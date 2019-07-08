const sqlite = require('sqlite3').verbose()
let articles = []
class Database {
  constructor () {

  }

  static pushIn (notes) {
    const db = new sqlite.Database('data.db', (err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Connected to the "data.db".')
    })
    db.serialize(() => {
      db.run('CREATE TABLE IF NOT EXISTS notes (tagsText TEXT, notesText TEXT)')
      let stmt = db.prepare('INSERT INTO notes VALUES (?,?)', [], (err) => {
        if (err) {
          return console.log('This is error ' + err)
        }
      })
      stmt.run(notes.tagsText, notes.notesText)
      stmt.finalize()
      db.close((err) => {
        if (err) {
          return console.error(err.message)
        }
        console.log('Close the database connection.')
      })
    })
  }

  static renderFrom () {
    const db = new sqlite.Database('data.db', (err) => {
      if (err) {
        return console.error(err.message)
      }
      articles = []
      console.log('Connected to the "data.db".')
    })
    db.serialize(() => {
      db.each('SELECT rowid AS id, tagsText, notesText FROM notes', (err, row) => {
        if (err) {
          return console.log('This is error ' + err.message)
        }
        articles.push({ id: row.id, tagsText: row.tagsText, notesText: row.notesText })
      })
    })
    db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Close the database connection.')
    })
    console.log('ARRRR----' + articles)
  }
}

module.exports = Database
