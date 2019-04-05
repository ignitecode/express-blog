const express = require('express');
const chalk = require('chalk');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Use middleware logging & POST body parsing
app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));

// Import our controller code
const blogController = require('./controllers/blogController');

// Setup our Views
app.set('views', './views');
app.set('view engine', 'ejs');

// Link our Controllers
app.use('/blogs', blogController);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(chalk.blue(`[INFO] Server Listening on Port: ${port}`));
});
