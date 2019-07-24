const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const notesRouter = require('./routes/notes');
const featuresRouter = require('./routes/features');
const addNotesRouter = require('./routes/addNotes');
const logsRouter = require('./routes/logs');

const app = express();

const server = require('./bin/www');
const io = require('socket.io')(server);

io.sockets.on('connection', (socket) => {
  socket.send('ads');
  console.log('notes.js');
  socket.on('message', (data) => {
    console.log(data);
  });
});

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(`${__dirname}/views`),
  partialsDir: path.join(`${__dirname}/partials`),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))

  .use('/api/v1/', indexRouter)
  .use('/api/v1/notes', notesRouter)
  .use('/api/v1/features', featuresRouter)
  .use('/api/v1/users', usersRouter)
  .use('/api/v1/addNotes', addNotesRouter)
  .use('/logs', logsRouter)

  .use((req, res, next) => {
    next(createError(404));
  })
  .use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;
