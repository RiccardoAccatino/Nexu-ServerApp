const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'nexu-secret-key', // Cambia questa chiave in produzione!
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // true solo se usi HTTPS
}));

app.use(express.static(path.join(__dirname, '../public')));
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});
