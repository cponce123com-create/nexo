import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from '../server/app.js';

async function fixture(t,options={}){
 const app=createApp({dbPath:':memory:',secureCookies:false,mailer:null,...options});
 await new Promise(resolve=>app.server.listen(0,'127.0.0.1',resolve));
 t.after(()=>new Promise(resolve=>app.server.close(()=>{app.db.close();resolve()})));
 const base=`http://127.0.0.1:${app.server.address().port}`;
 async function request(path,{method='GET',data,cookie}={}){const headers={};if(method!=='GET')headers.origin=base;if(cookie)headers.cookie=cookie;if(data!==undefined)headers['content-type']='application/json';const response=await fetch(base+path,{method,headers,body:data===undefined?undefined:JSON.stringify(data)});return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]}}
 return {...app,request};
}
const registration=(username)=>({email:`${username}@example.com`,username,password:'contrasena-segura'});
test('la página pública responde aunque falle el contador de visitas',async t=>{
 const {request,db}=await fixture(t);const owner=await request('/api/register',{method:'POST',data:registration('creador')});await request('/api/publish',{method:'POST',cookie:owner.cookie});db.exec('DROP TABLE daily_views');assert.equal((await request('/api/public/creador')).status,200);
});
test('la revisión impide que una sesión sobrescriba cambios de otra',async t=>{
 const {request}=await fixture(t);const owner=await request('/api/register',{method:'POST',data:registration('creador')});const first=(await request('/api/me',{cookie:owner.cookie})).data;const second=structuredClone(first);first.page.name='Nombre guardado';second.page.bio='Edición antigua';assert.equal((await request('/api/page',{method:'PUT',cookie:owner.cookie,data:{page:first.page,revision:first.revision}})).status,200);assert.equal((await request('/api/page',{method:'PUT',cookie:owner.cookie,data:{page:second.page,revision:second.revision}})).status,409);assert.equal((await request('/api/me',{cookie:owner.cookie})).data.page.name,'Nombre guardado');
});
test('una suspensión impide publicar hasta que la administración la levante',async t=>{
 const sent=[];const {request,db}=await fixture(t,{mailer:async mail=>sent.push(mail),adminEmails:'admin@example.com'});const owner=await request('/api/register',{method:'POST',data:registration('creador')});const admin=await request('/api/register',{method:'POST',data:{...registration('adminuser'),email:'admin@example.com'}});db.exec('UPDATE users SET email_verified=1');await request('/api/publish',{method:'POST',cookie:owner.cookie});await request('/api/report',{method:'POST',data:{username:'creador',reason:'fraude'}});const report=(await request('/api/admin/reports',{cookie:admin.cookie})).data.reports[0];assert.equal((await request('/api/admin/report-action',{method:'POST',cookie:admin.cookie,data:{id:report.id,action:'unpublish'}})).status,200);assert.equal((await request('/api/publish',{method:'POST',cookie:owner.cookie})).status,409);assert.equal((await request('/api/admin/report-action',{method:'POST',cookie:admin.cookie,data:{id:report.id,action:'restore'}})).status,200);assert.equal((await request('/api/publish',{method:'POST',cookie:owner.cookie})).status,200);
});
test('se puede guardar un producto incompleto, pero no publicarlo',async t=>{
 const {request}=await fixture(t);const owner=await request('/api/register',{method:'POST',data:registration('creador')});const me=(await request('/api/me',{cookie:owner.cookie})).data;me.page.store.products=[{id:'1',name:'Polo',price:'',visible:true}];assert.equal((await request('/api/page',{method:'PUT',cookie:owner.cookie,data:{page:me.page,revision:me.revision}})).status,200);assert.equal((await request('/api/publish',{method:'POST',cookie:owner.cookie})).status,400);
});
