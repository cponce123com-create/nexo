import {DatabaseSync} from 'node:sqlite';
export function openDatabase(path){
 const db=new DatabaseSync(path);db.exec(`PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;
 CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, created_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS pages (user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, username TEXT NOT NULL UNIQUE, draft TEXT NOT NULL, published TEXT, updated_at INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, page_id INTEGER NOT NULL REFERENCES pages(user_id) ON DELETE CASCADE, kind TEXT NOT NULL, link_id TEXT, created_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS events_page_time ON events(page_id,created_at);
 `);return db;
}
