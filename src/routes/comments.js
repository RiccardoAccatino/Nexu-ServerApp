const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.status(401).json({ error: 'Non autorizzato' });
}

// Crea un commento
router.post('/', isAuthenticated, commentController.createComment);

// Ottieni tutti i commenti di un post
router.get('/:post_id', commentController.getCommentsByPost);

module.exports = router;