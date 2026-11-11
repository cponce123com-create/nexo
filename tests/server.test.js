import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.js';

test('cuentas, borradores, publicación, privacidad y cierre de sesión',async t=>{
 const {server,db}=createApp({dbPath:':memory:',secureCookies:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(()=>{db.close();r()})));
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.equal((await fetch(base+'/demo')).status,200);
 async function call(path,{method='GET',data,cookie,origin=base}={}){const headers={};if(method!=='GET')headers.origin=origin;if(data!==undefined)headers['content-type']='application/json';if(cookie)headers.cookie=cookie;const res=await fetch(base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});return {status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]}}
 const a=await call('/api/register',{method:'POST',data:{email:'a@example.com',password:'contrasena-segura',username:'aitana'}});assert.equal(a.status,200);
 const b=await call('/api/register',{method:'POST',data:{email:'b@example.com',password:'contrasena-segura',username:'carlos'}});assert.equal(b.status,200);
 assert.equal((await call('/api/public/aitana')).status,404);
 const me=await call('/api/me',{cookie:a.cookie});assert.equal(me.data.page.username,'aitana');const ownB=await call('/api/me',{cookie:b.cookie});assert.equal(ownB.data.page.username,'carlos');
 const page=me.data.page;page.name='Aitana';page.links=[{id:'secret',title:'Privado',url:'https://example.com',visible:false}];page.store={phone:'51912345678',currency:'PEN',products:[{id:'a',name:'Polo',price:'25.50',image:'',visible:true}]};
 const duplicated=structuredClone(page);duplicated.links=[{id:'same',title:'a',url:'https://example.com'},{id:'same',title:'b',url:'https://example.com'}];assert.equal((await call('/api/page',{method:'PUT',cookie:a.cookie,data:{page:duplicated}})).status,400);const oversized=structuredClone(page);oversized.store.products=Array.from({length:7},(_,i)=>({id:String(i)}));assert.equal((await call('/api/page',{method:'PUT',cookie:a.cookie,data:{page:oversized}})).status,400);assert.equal((await call('/api/page',{method:'PUT',cookie:a.cookie,data:{page}})).status,200);assert.equal((await call('/api/publish',{method:'POST',cookie:a.cookie})).status,200);
 let pub=await call('/api/public/aitana');assert.equal(pub.data.page.store.products[0].name,'Polo');assert.equal(pub.data.page.links.length,0);
 page.name='Cambio privado';assert.equal((await call('/api/page',{method:'PUT',cookie:a.cookie,data:{page}})).status,200);pub=await call('/api/public/aitana');assert.equal(pub.data.page.name,'Aitana');
 assert.equal((await call('/api/stats',{cookie:b.cookie})).data.views30d,0);assert.equal((await call('/api/stats',{cookie:a.cookie})).data.views30d,2);
 const steal=structuredClone(ownB.data.page);steal.username='aitana';assert.equal((await call('/api/page',{method:'PUT',cookie:b.cookie,data:{page:steal}})).status,409);
 assert.equal((await call('/api/unpublish',{method:'POST',cookie:a.cookie,origin:'https://evil.example'})).status,403);assert.equal((await call('/api/unpublish',{method:'POST',cookie:a.cookie})).status,200);assert.equal((await call('/api/public/aitana')).status,404);
 assert.equal((await call('/api/logout',{method:'POST',cookie:a.cookie})).status,200);assert.equal((await call('/api/me',{cookie:a.cookie})).status,401);assert.equal((await call('/api/me',{cookie:b.cookie})).status,200);
});

test('cambio de contraseña y revocación de sesiones',async t=>{
 const {server,db}=createApp({dbPath:':memory:',secureCookies:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(()=>{db.close();r()})));const base=`http://127.0.0.1:${server.address().port}`;
 async function req(path,{method='GET',data,cookie}={}){const h={};if(method!=='GET')h.origin=base;if(data)h['content-type']='application/json';if(cookie)h.cookie=cookie;const r=await fetch(base+path,{method,headers:h,body:data?JSON.stringify(data):undefined});return {status:r.status,cookie:r.headers.get('set-cookie')?.split(';')[0]}}
 const data={email:'test@example.com',password:'contrasena-segura',username:'usuario'};
 const a=await req('/api/register',{method:'POST',data});const b=await req('/api/login',{method:'POST',data});
 assert.equal((await req('/api/password',{method:'POST',cookie:a.cookie,data:{currentPassword:'incorrecta',newPassword:'nueva-clave-segura'}})).status,401);
 assert.equal((await req('/api/sessions/revoke',{method:'POST',cookie:a.cookie})).status,200);assert.equal((await req('/api/me',{cookie:b.cookie})).status,401);assert.equal((await req('/api/me',{cookie:a.cookie})).status,200);
 assert.equal((await req('/api/password',{method:'POST',cookie:a.cookie,data:{currentPassword:data.password,newPassword:'nueva-clave-segura'}})).status,200);assert.equal((await req('/api/me',{cookie:a.cookie})).status,401);
 assert.equal((await req('/api/login',{method:'POST',data})).status,401);assert.equal((await req('/api/login',{method:'POST',data:{...data,password:'nueva-clave-segura'}})).status,200);
});

test('verificación y recuperación con tokens temporales de un solo uso',async t=>{
 const sent=[];const {server,db}=createApp({dbPath:':memory:',secureCookies:false,mailer:async msg=>sent.push(msg)});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(()=>{db.close();r()})));const base=`http://127.0.0.1:${server.address().port}`;
 async function req(path,{method='GET',data,cookie}={}){const h={};if(method!=='GET')h.origin=base;if(data)h['content-type']='application/json';if(cookie)h.cookie=cookie;const r=await fetch(base+path,{method,headers:h,body:data?JSON.stringify(data):undefined});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]}}
 const account={email:'prueba@example.com',password:'contrasena-segura',username:'prueba'};const a=await req('/api/register',{method:'POST',data:account});assert.equal((await req('/api/publish',{method:'POST',cookie:a.cookie})).status,403);
 assert.equal((await req('/api/verification/request',{method:'POST',cookie:a.cookie})).status,200);const verify=sent.at(-1).token;assert.equal((await req('/api/verify',{method:'POST',data:{token:verify}})).status,200);assert.equal((await req('/api/verify',{method:'POST',data:{token:verify}})).status,400);assert.equal((await req('/api/publish',{method:'POST',cookie:a.cookie})).status,200);
 assert.equal((await req('/api/password/forgot',{method:'POST',data:{email:'ausente@example.com'}})).status,200);assert.equal((await req('/api/password/forgot',{method:'POST',data:{email:account.email}})).status,200);const reset=sent.at(-1).token;
 assert.equal((await req('/api/password/reset',{method:'POST',data:{token:reset,password:'nueva-contrasena'}})).status,200);assert.equal((await req('/api/password/reset',{method:'POST',data:{token:reset,password:'nueva-contrasena'}})).status,400);assert.equal((await req('/api/me',{cookie:a.cookie})).status,401);assert.equal((await req('/api/login',{method:'POST',data:{...account,password:'nueva-contrasena'}})).status,200)
});

test('importación de imágenes y aislamiento de tiendas',async t=>{
 const {server,db}=createApp({dbPath:':memory:',secureCookies:false,mailer:null});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(()=>{db.close();r()})));const base=`http://127.0.0.1:${server.address().port}`;
 async function request(path,{method='GET',data,cookie}={}){const headers={};if(method!=='GET')headers.origin=base;if(data!==undefined)headers['content-type']='application/json';if(cookie)headers.cookie=cookie;const r=await fetch(base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});const type=r.headers.get('content-type')||'';return {status:r.status,data:type.includes('json')?await r.json():null,cookie:r.headers.get('set-cookie')?.split(';')[0],type}}
 const one=await request('/api/register',{method:'POST',data:{email:'uno@example.com',password:'contrasena-segura',username:'uno'}});const two=await request('/api/register',{method:'POST',data:{email:'dos@example.com',password:'contrasena-segura',username:'dos'}});
 assert.equal((await request('/api/images',{method:'POST',data:{data:Buffer.from('<svg></svg>').toString('base64')},cookie:one.cookie})).status,400);
 const png='iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=';
 const image=await request('/api/images',{method:'POST',data:{data:png},cookie:one.cookie});assert.equal(image.status,201);assert.equal((await request(image.data.url,{cookie:one.cookie})).type,'image/png');assert.equal((await request(image.data.url)).status,404);assert.equal((await request(image.data.url,{cookie:two.cookie})).status,404);
 const user2=await request('/api/me',{cookie:two.cookie});user2.data.page.store.products=[{id:'x',name:'Ajeno',price:'10',salePrice:'5',image:image.data.url,visible:true}];assert.equal((await request('/api/page',{method:'PUT',cookie:two.cookie,data:{page:user2.data.page}})).status,400);
 const user1=await request('/api/me',{cookie:one.cookie});user1.data.page.store.products=[{id:'x',name:'Polo',price:'10',salePrice:'5',image:image.data.url,visible:true}];assert.equal((await request('/api/page',{method:'PUT',cookie:one.cookie,data:{page:user1.data.page}})).status,200);assert.equal((await request(image.data.url)).status,404);assert.equal((await request('/api/publish',{method:'POST',cookie:one.cookie})).status,200);assert.equal((await request(image.data.url)).status,200);const pub=await request('/api/public/uno');assert.equal(pub.data.page.store.products[0].salePrice,'5');assert.equal((await request('/api/unpublish',{method:'POST',cookie:one.cookie})).status,200);assert.equal((await request(image.data.url)).status,404)
});
