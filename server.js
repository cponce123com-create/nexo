import {createApp} from './server/app.js';
const port=Number(process.env.PORT||3000),app=createApp({dbPath:process.env.DATABASE_PATH||'nexo.sqlite'});
app.server.listen(port,()=>console.log(`NEXO disponible en el puerto ${port}`));
function stop(){app.server.close(()=>{app.db.close();process.exit(0)})}process.on('SIGTERM',stop);process.on('SIGINT',stop);
