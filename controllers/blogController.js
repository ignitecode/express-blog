const express = require('express');
const router = express.Router();

// An [] of blog posts (our mock database)
const data = require('../data/blog_data.json');

router.get('/', (req, res) => {
  res.render('blog.ejs', { data: data });
});

router.get('/new', (req, res) => {
  res.render('create_blog.ejs');
});

// Handles the POST request from the EJS form.
router.post('/new', (req, res) => {
  data.push({
    content: req.body.content,
    title: req.body.title,
    description: req.body.description,
    id: data.length,
  });

  res.json({ success: true, body: req.body });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.render('blog_detail.ejs', { data: data[id] });
});

module.exports = router;
