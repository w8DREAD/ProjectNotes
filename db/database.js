const sqlite = require('sqlite3').verbose()

let articles = []

function dbConnect (method, post, tags) {
  return new Promise((resolve, reject) => {
    const db = new sqlite.Database('data.db', (err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Connected to the "data.db".')
    })
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS notes (post TEXT, tags TEXT)')
      if (method == 'post') {
        let stmt = db.prepare('INSERT INTO notes VALUES (?,?)', [], (err) => {
          if (err) {
            return console.log('This is error ' + err)
          }
        })
        stmt.run(post, tags)
        stmt.finalize()
      }

      articles = []
      db.each('SELECT rowid AS id, post, tags FROM notes', (err, row) => {
        if (err) {
          return console.log('This is error ' + err.message)
        }
        articles.push({ rowId: row.id, post: row.post, tags: JSON.parse(row.tags) })
      })
    })

    db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Close the database connection.')
    })
    if (articles) {
      resolve(articles)
    } else {
      reject(new Error('error'))
    }
  })
}

module.exports = dbConnect
