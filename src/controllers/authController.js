const User = require('../models/user');
const db = require('../db/sqlite');
const bcrypt = require('bcrypt');

exports.register = (req, res, callback) => {
    const { name, email, password } = req.body;
    User.create({ name, email, password }, (err, userId) => {
        if (err) return callback(null);
        User.findById(userId, (err, user) => {
            if (err) return callback(null);
            callback(user);
        });
    });
};

exports.login = (req, res, callback) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
        if (err || !user || user.password !== password) {
            return callback(null);
        }
        callback(user);
    });
};

exports.updateName = (req, res) => {
    const userId = req.session.user.id;
    const { name } = req.body;
    db.run('UPDATE users SET name = ? WHERE id = ?', [name, userId], function(err) {
        if (err) return res.status(500).json({ error: 'Errore aggiornamento nome' });
        req.session.user.name = name;
        res.json({ success: true });
    });
};

exports.updatePassword = (req, res) => {
    const userId = req.session.user.id;
    const { oldPassword, newPassword } = req.body;
    db.get('SELECT password FROM users WHERE id = ?', [userId], (err, row) => {
        if (err || !row) return res.status(500).json({ error: 'Utente non trovato' });
        // Confronta la password attuale
        require('bcrypt').compare(oldPassword, row.password, (err, same) => {
            if (err) return res.status(500).json({ error: 'Errore confronto password' });
            if (!same) return res.status(400).json({ error: 'Password attuale errata' });
            // Aggiorna la password
            require('bcrypt').hash(newPassword, 10, (err, hash) => {
                if (err) return res.status(500).json({ error: 'Errore hash password' });
                db.run('UPDATE users SET password = ? WHERE id = ?', [hash, userId], function(err) {
                    if (err) return res.status(500).json({ error: 'Errore aggiornamento password' });
                    res.json({ success: true });
                });
            });
        });
    });
};