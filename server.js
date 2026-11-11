import {createApp} from './server/app.js';
import {openPostgres} from './server/postgres.js';
import {createCloudinaryStorage} from './server/cloud.js';
const production=process.env.NODE_ENV==='production';
if(production){for(const key of ['DATABASE_URL','CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET','RESEND_API_KEY','MAIL_FROM','PUBLIC_URL'])if(!process.env[key])throw Error(`Falta configurar ${key} para producción.`)}
const database=process.env.DATABASE_URL?await openPostgres(process.env.DATABASE_URL):null;
const storage=createCloudinaryStorage();
if(Boolean(database)!==Boolean(storage))throw Error('Configura PostgreSQL y Cloudinary conjuntamente.');
const port=Number(process.env.PORT||3000),app=createApp({dbPath:process.env.DATABASE_PATH||'nexo.sqlite',database,storage});
app.server.listen(port,'0.0.0.0',()=>console.log(`NEXO disponible en el puerto ${port}`));
function stop(){app.server.close(async()=>{await app.db.close();process.exit(0)})}process.on('SIGTERM',stop);process.on('SIGINT',stop);
