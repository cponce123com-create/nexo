import {openDatabase} from '../server/database.js';
import {resolve} from 'node:path';
import {existsSync} from 'node:fs';
const [source,destination]=process.argv.slice(2);
if(!source||!destination||resolve(source)===resolve(destination)||!existsSync(source)||existsSync(destination)){console.error('Uso: node scripts/backup.js BASE_EXISTENTE COPIA_NUEVA');process.exit(1)}
const db=openDatabase(source);try{db.prepare('VACUUM INTO ?').run(resolve(destination));console.log('Copia creada. Guárdala de forma segura y verifica su restauración.')}finally{db.close()}
