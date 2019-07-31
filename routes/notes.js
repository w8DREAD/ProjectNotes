const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware');

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

router.post('/like', async (req, res, next) => {
  const {noteId} = req.body;
  const userId = req.user.id;
  if (await control.Like.create({noteId, userId})) {
    res.status(200).json({status: true});
  } else {
    res.status(200).json({status: false});
  }
});

router.put('/:id', async (req, res, next) => {
  const text = req.body;
  const {id} = req.params;
  await control.Note.edit(text, id);
  res.status(200);
});

router.delete('/:id', async (req, res, next) => {
  const {id} = req.params;
  await control.Note.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

module.exports = router;
