const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../database.db'), (err) => {
    if (err) {
        console.error('Errore apertura database:', err.message);
    } else {
        console.log('Connesso al database SQLite.');
    }
});

module.exports = db;

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        admin INTEGER DEFAULT 0,
        timeout_until INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS post (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        testo TEXT,
        immagine TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS commenti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    testo TEXT,
    FOREIGN KEY(post_id) REFERENCES post(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
    );`);
    db.run(`CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    value INTEGER NOT NULL,
    UNIQUE(user_id, post_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(post_id) REFERENCES post(id)
    )`);
});