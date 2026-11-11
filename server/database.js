import {DatabaseSync} from 'node:sqlite';
export function openDatabase(path){
 const db=new DatabaseSync(path);db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS pages (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, username TEXT NOT NULL UNIQUE, draft TEXT NOT NULL, published TEXT, updated_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, page_id INTEGER NOT NULL REFERENCES pages(user_id) ON DELETE CASCADE, kind TEXT NOT NULL, link_id TEXT, created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS daily_views (page_id INTEGER NOT NULL REFERENCES pages(user_id) ON DELETE CASCADE, day INTEGER NOT NULL, count INTEGER NOT NULL DEFAULT 0, PRIMARY KEY(page_id,day));
 CREATE TABLE IF NOT EXISTS account_tokens (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, purpose TEXT NOT NULL, expires_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS account_tokens_user ON account_tokens(user_id,purpose);
 CREATE INDEX IF NOT EXISTS events_page_time ON events(page_id,created_at);
 `);
 const cols=db.prepare('PRAGMA table_info(users)').all();if(!cols.some(col=>col.name==='email_verified'))db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0');
 return db;
}
