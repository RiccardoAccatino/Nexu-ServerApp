// Middleware autenticazione che gestisce anche il timeout utente
module.exports = function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        // Se l'utente è in timeout, blocca l'accesso a tutte le azioni protette
        if (req.session.user.timeout_until && req.session.user.timeout_until > Date.now()) {
            return res.status(403).json({ error: 'Utente in timeout fino al ' + new Date(req.session.user.timeout_until).toLocaleString() });
        }
        return next();
    }
    res.status(401).json({ error: 'Non autorizzato' });
};