const fs = require('fs');
const path = require('path');

const spdy = require('spdy')
const express = require('express');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const logger = require('morgan')

const routes = require('./routes');

const app = express();
const port = 3000;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert:  fs.readFileSync(path.join(__dirname, 'server.crt'))
}

// setup
app.set('view engine', 'pug');
app.use(logger('dev'))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

// routes
app.use(routes);

spdy
  .createServer(options, app)
  .listen(port, () => console.log(chalk.magenta([
      '┌-----------------------------┐',
      `| App listening on port: ${port} |`,
      '└-----------------------------┘'
    ].join('\n'))));