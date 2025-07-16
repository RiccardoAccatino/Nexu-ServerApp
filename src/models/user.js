const db = require('../db/sqlite');

const User = {
    create: (userData, callback) => {
        const sql = 'INSERT INTO users (name, email, password, admin) VALUES (?, ?, ?, ?)';
        db.run(sql, [userData.name, userData.email, userData.password, userData.admin || 0], function(err) {
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
    },
    setTimeout: (userId, untilTimestamp, callback) => {
        db.run('UPDATE users SET timeout_until = ? WHERE id = ?', [untilTimestamp, userId], callback);
    }
};

module.exports = User;