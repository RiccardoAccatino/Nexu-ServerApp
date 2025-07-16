const User = require('../models/user');
const db = require('../db/sqlite');
const bcrypt = require('bcrypt');

exports.register = (req, res, callback) => {
    const { name, email, password } = req.body;
    // Gli admin si creano solo dal database, quindi admin = 0
    User.create({ name, email, password, admin: 0 }, (err, userId) => {
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
        if (err || !user) {
            return callback(null);
        }
        // Se utente in timeout blocca il login
        if (user.timeout_until && user.timeout_until > Date.now()) {
            return callback({ timeout: true, until: user.timeout_until });
        }
        // Se usi bcrypt, decommenta questo e togli il controllo diretto
        /*
        bcrypt.compare(password, user.password, (err, same) => {
            if (err || !same) return callback(null);
            callback(user);
        });
        */
        // Altrimenti (password in chiaro, NON SICURO!):
        if (user.password !== password) return callback(null);
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
        // bcrypt.compare(oldPassword, row.password, (err, same) => {
        //     if (err) return res.status(500).json({ error: 'Errore confronto password' });
        //     if (!same) return res.status(400).json({ error: 'Password attuale errata' });
        //     bcrypt.hash(newPassword, 10, (err, hash) => {
        //         if (err) return res.status(500).json({ error: 'Errore hash password' });
        //         db.run('UPDATE users SET password = ? WHERE id = ?', [hash, userId], function(err) {
        //             if (err) return res.status(500).json({ error: 'Errore aggiornamento password' });
        //             res.json({ success: true });
        //         });
        //     });
        // });
        // Altrimenti (password in chiaro, NON SICURO!):
        if (oldPassword !== row.password) return res.status(400).json({ error: 'Password attuale errata' });
        db.run('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId], function(err) {
            if (err) return res.status(500).json({ error: 'Errore aggiornamento password' });
            res.json({ success: true });
        });
    });
};

// Funzionalità: timeout
exports.setUserTimeout = (req, res) => {
    // Solo admin
    if (!req.session.user.admin) {
        return res.status(403).json({ error: 'Solo admin può mettere in timeout' });
    }
    const userId = req.params.id;
    const { duration } = req.body; // '1d', '1w', '1m', '1y'
    const now = Date.now();
    let until;
    switch (duration) {
        case '1d': until = now + 24*60*60*1000; break;
        case '1w': until = now + 7*24*60*60*1000; break;
        case '1m': until = now + 30*24*60*60*1000; break;
        case '1y': until = now + 365*24*60*60*1000; break;
        default: return res.status(400).json({ error: 'Durata non valida' });
    }
    User.setTimeout(userId, until, function(err) {
        if (err) return res.status(500).json({ error: 'Errore timeout' });
        res.json({ success: true, until });
    });
};