const news = require('../routes/news')
const index = require('../routes/index')
const features = require('../routes/features')
const users = require('../routes/users')

const db = require('../db/database')
const model = require('./model')

class GetPost {
  constructor (post, tags) {
    this.post = post
    this.tags = tags
  }
  static forRender (text) {
    let tags = text.filter(str => str[0] == '#')
    let post = text.filter(str => str[0] != '#').join(' ')
      return new GetPost(post, tags)
  }
}

module.exports = { GetPost: GetPost }
