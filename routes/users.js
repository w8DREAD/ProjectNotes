var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/', (req, res) => {
  console.log(req.body)
  res.send('post')
})

module.exports = router
