const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const schemes = require('../schemes');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.post('/', middleware.auth(), middleware.async(async (req, res, next) => {
  const {noteId} = req.body;
  const user = req.user;
  res.status(200).json({
    status: await control.Like.create({noteId, user}),
    likesCount: await control.Like.takeRedis(user.email),
  });
}));

module.exports = router;
