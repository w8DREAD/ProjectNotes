const sqlite = require('sqlite3').verbose()
const Handler = require('../mvc/model')

const test = [{id: 1, tagsText: 'dasdasda', notesText: 'eqweqwesd'}, {id: 2, tagsText: 'vccvcvx', notesText: 'hgfhfghfgh'}, {id: 3, tagsText: 'yyyyyyyyyyy', notesText: 'ssssssssss'}]
let articles = []

class Database {
  constructor () {

  }

 static async pushIn (notes) {
    const db = new sqlite.Database('data.db', (err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Connected to the "data.db".')
    })
   try {
      await db.serialize( async () => {
        db.run('CREATE TABLE IF NOT EXISTS notes (tagsText TEXT, notesText TEXT)')
        try {
          let stmt = await db.prepare('INSERT INTO notes VALUES (?,?)', [], (err) => {
            if (err) {
              return console.log('This is error ' + err)
            }
          })
          stmt.run(notes.tagsText, notes.notesText)
          stmt.finalize()
        }
        catch (e) {
          return console.log(e.message)
        }
        db.close((err) => {
          if (err) {
            return console.error(err.message)
          }
        })
      })
     return  console.log('Close the database connection.')
   }
   catch (e) {
     return console.log(e.message)
   }

  }

  static async renderFrom () {

    async function pushNotes(note) {
      articles.push(note)
    }

    const db = new sqlite.Database('data.db', (err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Connected to the "data.db".')
      db.serialize(async () => {
        db.each('SELECT rowid AS id, tagsText, notesText FROM notes', async (err, row) => {
          if (err) {
            return console.log('This is error ' + err.message)
          }
          await pushNotes(row)
        })
        console.log(articles)
      })
    })

    db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      console.log('Close the database connection.')
    })
  }
}


module.exports = Database
