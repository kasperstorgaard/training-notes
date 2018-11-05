const express = require('express');
const chalk = require('chalk');
const path = require('path');

const homeRouter = require('./routes/home/index');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.use(homeRouter);

app.listen(port, () => console.log(chalk.magenta([
  '┌-----------------------------┐',
  `| App listening on port: ${port} |`,
  '└-----------------------------┘'
].join('\n'))));