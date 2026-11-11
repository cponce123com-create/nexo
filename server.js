import {createApp} from './server/app.js';
if(process.env.NODE_ENV==='production'&&(!process.env.RESEND_API_KEY||!process.env.MAIL_FROM||!process.env.PUBLIC_URL))throw Error('Para producción configura RESEND_API_KEY, MAIL_FROM y PUBLIC_URL.');
const port=Number(process.env.PORT||3000),app=createApp({dbPath:process.env.DATABASE_PATH||'nexo.sqlite'});
app.server.listen(port,()=>console.log(`NEXO disponible en el puerto ${port}`));
function stop(){app.server.close(()=>{app.db.close();process.exit(0)})}process.on('SIGTERM',stop);process.on('SIGINT',stop);
