import {randomBytes,scrypt as scryptCallback,timingSafeEqual,createHash} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCallback);
export async function hashPassword(password){const salt=randomBytes(16).toString('hex');const key=await scrypt(password,salt,64);return `${salt}:${key.toString('hex')}`}
export async function verifyPassword(password,stored){try{const [salt,hex]=stored.split(':');if(!/^[a-f0-9]{32}$/.test(salt)||!/^[a-f0-9]{128}$/.test(hex))return false;const key=await scrypt(password,salt,64);return timingSafeEqual(key,Buffer.from(hex,'hex'))}catch{return false}}
export const token=()=>randomBytes(32).toString('base64url');
export const tokenHash=value=>createHash('sha256').update(value).digest('hex');
export function parseCookies(raw=''){return Object.fromEntries(raw.split(';').map(v=>v.trim().split(/=(.*)/s).slice(0,2)).filter(([k,v])=>k&&v))}
export const normalizeEmail=value=>typeof value==='string'?value.trim().toLowerCase():'';
export const validEmail=email=>email.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validPassword=value=>typeof value==='string'&&value.length>=12&&value.length<=128;
export const validUsername=value=>typeof value==='string'&&/^[a-z0-9](?:[a-z0-9_-]{1,28}[a-z0-9])$/.test(value)&&!new Set(['admin','api','login','register','www','dashboard','support','nexo']).has(value);
export function sameOrigin(req){const origin=req.headers.origin;if(!origin)return false;try{return new URL(origin).host===req.headers.host && ['http:','https:'].includes(new URL(origin).protocol)}catch{return false}}
