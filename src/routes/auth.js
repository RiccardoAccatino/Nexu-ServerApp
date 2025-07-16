const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/user');
const isAuthenticated = require('../middleware/authMiddleware');

// Login
router.post('/login', (req, res) => {
    authController.login(req, res, (userOrTimeout) => {
        if (userOrTimeout && userOrTimeout.timeout) {
            // L'utente è in timeout
            return res.status(403).json({ error: 'Sei in timeout fino al ' + new Date(userOrTimeout.until).toLocaleString() });
        }
        if (userOrTimeout) {
            req.session.user = {
                id: userOrTimeout.id,
                email: userOrTimeout.email,
                name: userOrTimeout.name,
                admin: userOrTimeout.admin,
                timeout_until: userOrTimeout.timeout_until
            };
            res.json({ message: 'Login effettuato', user: req.session.user });
        } else {
            res.status(401).json({ error: 'Credenziali non valide' });
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout effettuato' });
    });
});

// Signup
router.post('/register', (req, res) => {
    authController.register(req, res, (user) => {
        if (user) {
            req.session.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                admin: user.admin,
                timeout_until: user.timeout_until
            };
            res.json({ message: 'Registrazione effettuata', user: req.session.user });
        } else {
            res.status(500).json({ error: 'Errore registrazione' });
        }
    });
});

// Verifica login
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ logged: true, user: req.session.user });
    } else {
        res.json({ logged: false });
    }
});

// Modifica nome e password
router.post('/update-name', isAuthenticated, authController.updateName);
router.post('/update-password', isAuthenticated, authController.updatePassword);

// Timeout utente (solo admin)
router.post('/timeout/:id', isAuthenticated, authController.setUserTimeout);

module.exports = router;