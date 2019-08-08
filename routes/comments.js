const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();
const control = require('../mvc/control');
const schema = require('../schemes');
const middleware = require('../auth/middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.post('/', middleware(), async (req, res, next) => {
  const comment = {
    text: req.body.text,
    id: +req.body.id,
    userId: +req.user.id,
  };
  const valid = schema.validator(schema.comments, comment);
  if (valid) {
    return res.status(400).json(valid);
  }
  const commentId = await control.Comment.create(comment);
  res.status(200).json({author: req.user.username, id: commentId[0].id});
});

router.delete('/:id', middleware(), async (req, res, next) => {
  const {id} = req.params;
  await control.Comment.delete(id);
  console.log('loading page');
  res.sendStatus(200);
});

module.exports = router;
