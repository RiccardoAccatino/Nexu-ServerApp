const db = require('../db/sqlite');

exports.createPost = (req, res) => {
    const { testo } = req.body;
    const user_id = req.session.user.id;
    let immagine = null;
    if (req.file) {
        immagine = '/uploads/' + req.file.filename;
    }
    const sql = 'INSERT INTO post (user_id, testo, immagine) VALUES (?, ?, ?)';
    db.run(sql, [user_id, testo, immagine], function(err) {
        if (err) return res.status(500).json({ error: 'Errore creazione post' });
        res.status(201).json({ id: this.lastID });
    });
};

exports.getAllPosts = (req, res) => {
    let sql = `
        SELECT post.*, users.name AS user_name,
        IFNULL(SUM(votes.value),0) AS votes
        FROM post
        JOIN users ON post.user_id = users.id
        LEFT JOIN votes ON post.id = votes.post_id
    `;
    const params = [];
    const where = [];
    if (req.query.testo) {
        where.push('post.testo LIKE ?');
        params.push('%' + req.query.testo + '%');
    }
    if (req.query.user) {
        where.push('users.name LIKE ?');
        params.push('%' + req.query.user + '%');
    }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' GROUP BY post.id ORDER BY post.id DESC';
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: 'Errore recupero post', details: err.message });
        res.json(rows);
    });
};

exports.deletePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user.id;
    db.get('SELECT * FROM post WHERE id = ?', [postId], (err, post) => {
        if (err || !post) return res.status(404).json({ error: 'Post non trovato' });
        if (post.user_id !== userId) return res.status(403).json({ error: 'Non autorizzato' });
        db.run('DELETE FROM post WHERE id = ?', [postId], function(err) {
            if (err) return res.status(500).json({ error: 'Errore eliminazione post' });
            res.json({ success: true });
        });
    });
};

exports.upvotePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user.id;
    db.run(
        `INSERT INTO votes (user_id, post_id, value) VALUES (?, ?, 1)
         ON CONFLICT(user_id, post_id) DO UPDATE SET value=1`,
        [userId, postId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Errore upvote' });
            res.json({ success: true });
        }
    );
};

exports.downvotePost = (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user.id;
    db.run(
        `INSERT INTO votes (user_id, post_id, value) VALUES (?, ?, -1)
         ON CONFLICT(user_id, post_id) DO UPDATE SET value=-1`,
        [userId, postId],
        function(err) {
            if (err) return res.status(500).json({ error: 'Errore downvote' });
            res.json({ success: true });
        }
    );
};