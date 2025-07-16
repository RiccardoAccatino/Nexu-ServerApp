const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const multer = require('multer');
const path = require('path');

// Configura multer per salvare le immagini in public/uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware autenticazione
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.status(401).json({ error: 'Non autorizzato' });
}

// Crea un post (con upload immagine)
router.post('/', isAuthenticated, upload.single('immagine'), postController.createPost);

// Ottieni tutti i post
router.get('/', postController.getAllPosts);

// Elimina un post (aggiornato: admin può eliminare tutti i post)
router.delete('/:id', isAuthenticated, postController.deletePost);

// Upvote/Downvote
router.post('/:id/upvote', isAuthenticated, postController.upvotePost);
router.post('/:id/downvote', isAuthenticated, postController.downvotePost);

module.exports = router;