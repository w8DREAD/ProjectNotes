const express = require('express');

const router = express.Router();
const control = require('../mvc/control');

router.get('/', (req, res, next) => {
  res.render('logs', {addClassLogs: 'active'});
});

module.exports = router;
