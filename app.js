const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const exphbs = require('express-handlebars')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const newsRouter = require('./routes/news')
const featuresRouter = require('./routes/features')

const app = express()

app.engine('.hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  layoutsDir: path.join(__dirname + '/views'),
  partialsDir: path.join(__dirname + '/partials')
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))

  .use('/', indexRouter)
  .use('/news', newsRouter)
  .use('/features', featuresRouter)
  .use('/users', usersRouter)

  .use(function (req, res, next) {
    next(createError(404))
  })
  .use(function (err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
  })

module.exports = app
