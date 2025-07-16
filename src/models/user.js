const db = require('../db/sqlite');

const User = {
    create: (userData, callback) => {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        db.run(sql, [userData.name, userData.email, userData.password], function(err) {
            callback(err, this.lastID);
        });
    },
    findByEmail: (email, callback) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            callback(err, row);
        });
    },
    findById: (id, callback) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            callback(err, row);
        });
    }
};

module.exports = User;