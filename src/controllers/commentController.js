const db = require('../db/sqlite');

exports.createComment = (req, res) => {
    const { post_id, testo } = req.body;
    const user = req.session.user;

    // Blocca admin dal commentare
    if (user.admin) {
        return res.status(403).json({ error: 'Gli admin non possono commentare.' });
    }

    // Blocca utenti in timeout
    if (user.timeout_until && user.timeout_until > Date.now()) {
        return res.status(403).json({ error: 'Utente in timeout, impossibile commentare.' });
    }

    const sql = 'INSERT INTO commenti (post_id, user_id, testo) VALUES (?, ?, ?)';
    db.run(sql, [post_id, user.id, testo], function(err) {
        if (err) return res.status(500).json({ error: 'Errore creazione commento', details: err.message });
        res.status(201).json({ id: this.lastID });
    });
};

exports.getCommentsByPost = (req, res) => {
    const post_id = req.params.post_id;
    db.all(
        `SELECT commenti.*, users.name AS user_name FROM commenti
         JOIN users ON commenti.user_id = users.id
         WHERE post_id = ? ORDER BY commenti.id ASC`,
        [post_id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: 'Errore recupero commenti' });
            res.json(rows);
        }
    );
};