const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const io = require('../bin/www');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', async (req, res, next) => {
  console.log('loading page');
  const data = await control.Note.forRendering() || [];
  res.render('notes', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: data.reverse(),
  });
});
router.post('/', async (req, res, next) => {
  const data = req.body;
  const id = Object.keys(data)[0];
  const text = req.body[id];
  await control.Comment.create(id, text);
  res.status(200);
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
