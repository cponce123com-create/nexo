import {v2 as cloudinary} from 'cloudinary';
import sharp from 'sharp';
export function createCloudinaryStorage({cloudName=process.env.CLOUDINARY_CLOUD_NAME,apiKey=process.env.CLOUDINARY_API_KEY,apiSecret=process.env.CLOUDINARY_API_SECRET,client=cloudinary,fetcher=fetch}={}){
 if(!cloudName||!apiKey||!apiSecret)return null;
 client.config({cloud_name:cloudName,api_key:apiKey,api_secret:apiSecret,secure:true});
 return {
  async upload(id,buffer){
   const clean=await sharp(buffer,{limitInputPixels:20_000_000,failOn:'error'}).rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
   const result=await new Promise((resolve,reject)=>{const stream=client.uploader.upload_stream({resource_type:'image',type:'authenticated',public_id:`nexo/${id}`,overwrite:false,invalidate:false},(err,value)=>err?reject(err):resolve(value));stream.end(clean)});
   return {publicId:result.public_id,mime:'image/webp',size:clean.length};
  },
  async read(publicId){const url=client.url(publicId,{type:'authenticated',resource_type:'image',sign_url:true,secure:true,format:'webp'});const response=await fetcher(url,{redirect:'error',signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('No se pudo recuperar la imagen.');const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>5*1024*1024)throw Error('Imagen excede el límite.');return bytes},
  async remove(publicId){const result=await client.uploader.destroy(publicId,{resource_type:'image',type:'authenticated',invalidate:true});if(!['ok','not found'].includes(result.result))throw Error('No se pudo borrar la imagen remota.')}
 };
}
