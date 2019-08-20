const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const schemes = require('../schemes');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', middleware.async(async (req, res, next) => {

  let name;
  let log = false;
  let likes = 0;

  if (req.user) {
    log = true;
    name = req.user.username;
    likes = await control.Like.takeRedis(req.user.email);
  }
  const notes = await control.Note.reproduce() || [];
  res.render('notes', {
    username: name,
    login: log,
    like: likes,
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: notes.reverse(),
  });
}));

module.exports = router;
