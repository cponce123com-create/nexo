export function createMailer({apiKey=process.env.RESEND_API_KEY,from=process.env.MAIL_FROM,baseUrl=process.env.PUBLIC_URL}={}){
 if(!apiKey||!from||!baseUrl)return null;
 const base=new URL(baseUrl);if(base.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(base.hostname))throw Error('PUBLIC_URL debe usar HTTPS');
 return async function send({to,token,purpose}){
  const link=new URL('/',base);link.hash=new URLSearchParams({[purpose]:token}).toString();
  const subject=purpose==='verify'?'Confirma tu correo en NEXO':'Recupera tu acceso a NEXO';
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[to],subject,text:`${subject}\n\nAbre este enlace: ${link.href}\n\nEl enlace vence en una hora. Si no solicitaste este mensaje, ignóralo.`})});
  if(!response.ok)throw Error('El proveedor de correo no aceptó el mensaje.');
 };
}
