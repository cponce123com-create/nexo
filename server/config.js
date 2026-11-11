const DATABASE='DATABASE_URL';
const CLOUDINARY=['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET'];
const MAIL=['RESEND_API_KEY','MAIL_FROM','PUBLIC_URL'];
function present(env,key){return typeof env[key]==='string' && env[key].trim().length>0}
export function validateConfig(env){
 const production=env.NODE_ENV==='production';
 const anyRemote=present(env,DATABASE)||CLOUDINARY.some(key=>present(env,key));
 const required=production?[DATABASE,...CLOUDINARY,...MAIL]:anyRemote?[DATABASE,...CLOUDINARY]:[];
 const missing=required.filter(key=>!present(env,key));
 if(missing.length)throw new Error(`Faltan variables de entorno: ${missing.join(', ')}. Configúralas en Render > Environment y vuelve a desplegar.`);
}
