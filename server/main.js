const express = require('express');
const chalk = require('chalk');
const path = require('path');

const homeRoutes = require('./routes/home/index');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../dist')));
app.use(homeRoutes);

app.get('/', (_req, res, _next) => {
  res.render('index', {
    page: 'Home',
    menuId: 'home',
    filename: './index.ejs'
  });
});

app.listen(port, () => console.log(chalk.magenta([
  '┌-----------------------------┐',
  `| App listening on port: ${port} |`,
  '└-----------------------------┘'
].join('\n'))));