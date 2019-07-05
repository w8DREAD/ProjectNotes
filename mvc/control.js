const news = require('../routes/news')
const index = require('../routes/index')
const features = require('../routes/features')
const users = require('../routes/users')

const db = require('../db/database')
const model = require('./model')
const views = require('./view')

class GetPost {
  constructor () {

  }
  static forRender (text) {
    let tags = text.filter(str => str[0] == '#')
    let post = text.filter(str => str[0] != '#').join(' ')
    views.ShowPosts.createPost(post, tags)
  }
}

module.exports = { GetPost: GetPost }
