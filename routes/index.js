const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

const urlEncodedParser = bodyParser.urlencoded({extended: false});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Заметки'});
});


router.get('/features', function(req, res, next) {
  res.render('features', { features: "Тут будут фичи"});
});


router.get('/news', function(req, res, next) {
  res.render('news', { news: "Тут будут новости"});
});


module.exports = router;
