const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
const control = require('../mvc/control');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  const notes = await control.Note.render() || [];
  res.render('notes', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: notes.reverse(),
  });
});
router.post('/', async (req, res, next) => {
  const text = req.body.text;
  const id = req.body.id
  await control.Comment.create(id, text);
  res.status(200);
});

router.post('/like', async (req, res, next) => {
  const {noteId, author} = req.body
  if (await control.Like.create({noteId, author})) {
    res.status(200).json({status: true})
  } else {
    res.status(200).json({status: false})
  }
});

router.put('/:id', async (req, res, next) => {
  const text = req.body.noteText;
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

module.exports = router;
