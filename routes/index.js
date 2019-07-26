const express = require('express');
const middleware = require('../auth/middleware');

const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

router.get('/', middleware(), (req, res, next) => {
  res.render('index', {
    username: req.user.username,
    login: true,
    title: 'Заметки',
    addClassMain: 'active',
  });
});

module.exports = router;
