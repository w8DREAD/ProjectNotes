const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const app = express()
const db = require('../db/database')

let data

class Article {
  constructor (news, tags) {
    this.id = id
    this.news = news
    this.tags = tags
    id++
  }
  static createArticle (news, tag) {
    let tags = []
    let arg = 1
    while (arg < arguments.length) {
      tags.push(arguments[arg])
      arg++
    }
    return new Article(news, tags)
  }
}

router.get('/', async (req, res, next) => {
  data = await db('get')
  res.render('news', {
    news: 'Тут будут новости',
    addClassNews: 'active',
    articles: data
  })
})

router.post('/', (req, res, next) => {
  let arrArticle = req.body.articles.split(' ')
  let tags = arrArticle.filter(str => str[0] == '#').join(' ')
  let news = arrArticle.filter(str => str[0] != '#').join(' ')

  if (req.body.articles) {
    db('post', news, tags)
  }
  res.redirect('/news')
})

module.exports = router
