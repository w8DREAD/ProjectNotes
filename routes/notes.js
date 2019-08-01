const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware');

const qwe = require('../mongodb/mongo');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  let userId;
  let name;
  let log = false;
  if (req.user) {
    userId = req.user.id;
    log = true;
    name = req.user.username;
  }
  const notes = await control.Note.render(userId) || [];
  // console.log(notes);
  res.render('notes', {
    username: name,
    login: log,
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: notes.reverse(),
  });
});

router.post('/like', middleware(), async (req, res, next) => {
  const {noteId} = req.body;
  const userId = req.user.id;
  if (await control.Like.create({noteId, userId})) {
    res.status(200).json({status: true});
  } else {
    res.status(200).json({status: false});
  }
});

router.put('/:id', middleware(), async (req, res, next) => {
  const text = req.body;
  const {id} = req.params;
  await control.Note.edit(text, id);
  res.status(200);
});

router.delete('/:id', middleware(), async (req, res, next) => {
  const {id} = req.params;
  await control.Note.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

module.exports = router;
