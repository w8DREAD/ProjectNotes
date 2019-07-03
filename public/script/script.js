let id = 0
let articles = []
let arrArticle = req.body.articles.split(' ')
let tags = arrArticle.filter(str => str[0] == '#')
let news = arrArticle.filter(str => str[0] != '#')

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
    articles.unshift(new Article(news, tags))
  }
}

Article.createArticle(news.join(' '), ...tags)
