const sqlite = require('sqlite3').verbose()
let articles = []
function dbConnect (method, news, tags) {
  const db = new sqlite.Database('data.db', (err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Connected to the "data.db".')
  })
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS news (news TEXT, tags TEXT)')
    if (method == 'post') {
      let stmt = db.prepare('INSERT INTO news VALUES (?,?)', [], (err) => {
        if (err) {
          return console.log('This is error ' + err)
        }
      })
      stmt.run(news, tags)
      stmt.finalize()
    }
    if (method == 'get') {
      articles = []
      db.each('SELECT rowid AS id, news, tags FROM news', (err, row) => {
        if (err) {
          return console.log('This is error ' + err.message)
        }
        articles.unshift({ news: row.news, tags: row.tags })
      })
    }
  })

  db.close((err) => {
    if (err) {
      return console.error(err.message)
    }
    console.log('Close the database connection.')
  })
  return articles
}

module.exports = dbConnect
