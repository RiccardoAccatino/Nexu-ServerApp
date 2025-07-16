// Middleware di esempio per autenticazione (da migliorare per produzione)
module.exports = (req, res, next) => {
    // Esempio: controlla se c'è un campo user_id nella richiesta
    if (req.body.user_id || req.query.user_id) {
        next();
    } else {
        res.status(401).json({ error: 'Non autorizzato' });
    }
};
module.exports = function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    res.status(401).json({ error: 'Non autorizzato' });
};