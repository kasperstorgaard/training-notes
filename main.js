const express = require('express');
const chalk = require('chalk');
const path = require('path');

const homeRouter = require('./routes/home');
const calendarRouter = require('./routes/calendar');

const app = express();
const port = 3000;

// setup
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));

// routes
app.use(homeRouter);
app.use(calendarRouter);

app.listen(port, () => console.log(chalk.magenta([
  '┌-----------------------------┐',
  `| App listening on port: ${port} |`,
  '└-----------------------------┘'
].join('\n'))));