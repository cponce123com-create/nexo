export const IMAGE_MAX_BYTES=2*1024*1024;
export function decodeImage(encoded){
 if(typeof encoded!=='string'||encoded.length>Math.ceil(IMAGE_MAX_BYTES/3)*4||!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded))return null;
 const data=Buffer.from(encoded,'base64');if(data.length===0||data.length>IMAGE_MAX_BYTES)return null;
 let type=null;if(data.length>=8&&data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))type='image/png';else if(data.length>=3&&data[0]===255&&data[1]===216&&data[2]===255)type='image/jpeg';else if(data.length>=12&&data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP')type='image/webp';
 return type?{data,type}:null;
}
