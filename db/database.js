const sqlite = require('sqlite3').verbose()
const Handler = require('../mvc/model')

const test = [{ id: 1, tagsText: 'dasdasda', notesText: 'eqweqwesd' }, { id: 2, tagsText: 'vccvcvx', notesText: 'hgfhfghfgh' }, { id: 3, tagsText: 'yyyyyyyyyyy', notesText: 'ssssssssss' }]
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
      db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS notes (tagsText TEXT, notesText TEXT)')
        let stmt = db.prepare('INSERT INTO notes VALUES (?,?)', (err) => {
          if (err) {
            return console.log('This is error ' + err)
          }
        })
        stmt.run(notes.tagsText, notes.notesText)
        stmt.finalize()
        console.log(notes)
      })
    })
    db.close((err) => {
      if (err) {
        return console.error(err.message)
      }
      return console.log('Close the database connection.')
    })
  }

  static async renderFrom () {
    const db = await new Promise((resolve, reject) => {
      console.log('Connected to the "data.db".')
      resolve(new sqlite.Database('data.db'))
    })
    db.serialize(() => {
      console.log('2233')
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

//   const db = new sqlite.Database('data.db', (err) => {
//     if (err) {
//       return console.error(err.message)
//     }
//     return console.log('Connected to the "data.db".')
//   })
//   console.log('111')
//   db.serialize(() => {
//   db.all('SELECT rowid AS id, * FROM notes', (err, row) => {
//   if (err) {
//     return console.log('This is error ' + err.message)
//   }
//   return row
// })
// console.log('222')
// })
// db.close((err) => {
//   if (err) {
//     return console.error(err.message)
//   }
//   console.log('Close the database connection.')
// })
// console.log('333')
// }
