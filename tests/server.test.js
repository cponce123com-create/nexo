import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.js';

test('cuentas, borradores, publicación, privacidad y cierre de sesión',async t=>{
 const {server,db}=createApp({dbPath:':memory:',secureCookies:false});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(()=>{db.close();r()})));
 const base=`http://127.0.0.1:${server.address().port}`;
 async function call(path,{method='GET',data,cookie,origin=base}={}){const headers={};if(method!=='GET')headers.origin=origin;if(data!==undefined)headers['content-type']='application/json';if(cookie)headers.cookie=cookie;const res=await fetch(base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});return {status:res.status,data:await res.json(),cookie:res.headers.get('set-cookie')?.split(';')[0]}}
 const a=await call('/api/register',{method:'POST',data:{email:'a@example.com',password:'contrasena-segura',username:'aitana'}});assert.equal(a.status,200);
 const b=await call('/api/register',{method:'POST',data:{email:'b@example.com',password:'contrasena-segura',username:'carlos'}});assert.equal(b.status,200);
 assert.equal((await call('/api/public/aitana')).status,404);
 const me=await call('/api/me',{cookie:a.cookie});assert.equal(me.data.page.username,'aitana');const ownB=await call('/api/me',{cookie:b.cookie});assert.equal(ownB.data.page.username,'carlos');
 const page=me.data.page;page.name='Aitana';page.links=[{id:'secret',title:'Privado',url:'https://example.com',visible:false}];page.store={phone:'51912345678',currency:'PEN',products:[{id:'a',name:'Polo',price:'25.50',image:'',visible:true}]};
 assert.equal((await call('/api/page',{method:'PUT',cookie:a.cookie,data:{page}})).status,200);assert.equal((await call('/api/publish',{method:'POST',cookie:a.cookie})).status,200);
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
