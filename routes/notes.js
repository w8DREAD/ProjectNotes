const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware')
const passport = require('passport')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
router.get('/', middleware(), async (req, res, next) => {
  const notes = await control.Note.render() || [];
  res.render('notes', {
    username: req.user.username,
    login: true,
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: notes.reverse(),
  });
});
router.post('/', async (req, res, next) => {
  const text = req.body.text;
  const id = req.body.id
  const author = req.user.username;
  await control.Comment.create(id, text, author);
  res.status(200).json({author: req.user.username});
});

router.post('/like', async (req, res, next) => {
  const noteId = req.body.noteId
  const userId = req.session.passport.user.id
  if (await control.Like.create({noteId, userId})) {
    res.status(200).json({status: true})
  } else {
    res.status(200).json({status: false})
  }
});

router.put('/:id', async (req, res, next) => {
  const text = req.body;
  const id = req.params.id;
  await control.Note.edit(text, id);
  res.status(200);
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  await control.Note.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

router.delete('/comments/:id', async (req, res, next) => {
  const id = req.params.id;
  await control.Comment.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

module.exports = router;
