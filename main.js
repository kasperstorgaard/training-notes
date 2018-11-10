const fs = require('fs');
const path = require('path');

const spdy = require('spdy')
const express = require('express');
const chalk = require('chalk');
const logger = require('morgan')

const homeRouter = require('./routes/home');
const calendarRouter = require('./routes/calendar');

const app = express();
const port = 3000;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert:  fs.readFileSync(path.join(__dirname, 'server.crt'))
}

// setup
app.set('view engine', 'pug');
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, './public')));

// routes
app.use(homeRouter);
app.use(calendarRouter);

app.get('/pushy', (req, res) => {
  var stream = res.push('/main.js', {
    status: 200, // optional
    method: 'GET', // optional
    request: {
      accept: '*/*'
    },
    response: {
      'content-type': 'application/javascript'
    }
  })
  stream.on('error', function() {
  })
  stream.end('alert("hello from push stream!");')
  res.end('<script src="/main.js"></script>')
})

spdy
  .createServer(options, app)
  .listen(port, () => console.log(chalk.magenta([
      '┌-----------------------------┐',
      `| App listening on port: ${port} |`,
      '└-----------------------------┘'
    ].join('\n'))));