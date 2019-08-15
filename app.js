const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const SessionStore = require('session-file-store')(session);
const routes = require('./routes');

const app = express();


require('./auth/passport')(app);
require('./db/redis');

app
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    secret: 'secretWord4ProjectNotes',
    name: 'sessionProjectNotes',
    store: new SessionStore(),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 30,
    },
    resave: false,
    saveUninitialized: false,
  }))
  .use(passport.initialize())
  .use(passport.session());

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(`${__dirname}/views`),
  partialsDir: path.join(`${__dirname}/partials`),
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app
  .use('/', routes.main)
  .use('/api/v1/notes', routes.notes)
  .use('/features', routes.features)
  .use('/api/v1/users', routes.users)
  .use('/addNote', routes.addNote)
  .use('/logs', routes.logs)
  .use('/api/v1/comments', routes.comments)
  .use('/pageNotes', routes.pageNotes)
  .use('/api/v1/tags', routes.tags)
  .use('/api/v1/likes', routes.likes)

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
