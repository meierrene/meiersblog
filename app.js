//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const ejs = require('ejs');
const _ = require('lodash');
const date = new Date();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(
  'mongodb+srv://masteruser:102030@defaultcluster.vh6up.mongodb.net/MeiersBlog?retryWrites=true&w=majority'
);

const Post = mongoose.model('Post', { title: String, content: String });

app.get('/', (req, res) => {
  Post.find({}, (err, p) => {
    res.render('home', {
      renderPosts: p,
      showYear: date.getFullYear(),
    });
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    showYear: date.getFullYear(),
  });
});

app.get('/contact', (req, res) => {
  res.render('contact', {
    showYear: date.getFullYear(),
  });
});

app.get('/compose', (req, res) => {
  res.render('compose', { showYear: date.getFullYear() });
});

app.get('/posts/:postid', (req, res) => {
  const matchID = req.params.postid;
  Post.findOne({ _id: matchID }, (err, p) => {
    res.render('post', {
      renderSelectedPost: p,
      showYear: date.getFullYear(),
    });
  });
});

app.post('/compose', (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  if (post.title && post.content) {
    post.save(err => {
      if (!err) res.redirect('/');
    });
  }
});

app.post('/delete', (req, res) => {
  const deleteBtn = req.body.deleteBtn;
  Post.findByIdAndRemove(deleteBtn, { _id: deleteBtn }, (err, _) => {
    if (!err) {
      res.redirect('/');
    }
  });
});

let port = process.env.PORT;
if (port == null || port == '') port = 3000;

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});

//localhost:3000/posts/another-post
