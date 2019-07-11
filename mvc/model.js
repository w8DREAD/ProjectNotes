const sqlite = require('sqlite3').verbose()

class Notes {
  constructor () {

  }

  static async pushInNoteDb (notes) {
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db".')
    })
      .then(db => {
        return new Promise((resolve, reject) => {
          db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS notes (tagsText TEXT, notesText TEXT)', err => {
              if (err) {
                reject(err)
              }
            })
            db.run('CREATE TABLE IF NOT EXISTS comments (postId INTEGER, comment TEXT, author TEXT)', err => {
              if (err) {
                reject(err)
              }
            })
            let stmt = db.prepare('INSERT INTO notes VALUES (?,?)', err => {
              if (err) {
                reject(err)
              }
            })
            stmt.run(notes.tagsText, notes.notesText)
            stmt.finalize()
          })
          db.close()
          console.log('Close the database connection.')
        })
      })
      .catch(reject => {
        return console.log('Ошибка работы с БД ---> ' + reject.message)
      })
  }

  static async pushInCommentDb (comment) {
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db".')
    })
      .then(db => {
        return new Promise((resolve, reject) => {
          db.serialize(() => {
            let stmt = db.prepare('INSERT INTO comments VALUES (?,?,?)', err => {
              if (err) {
                reject(err)
              }
            })
            stmt.run(comment.postId, comment.comment, comment.author)
            stmt.finalize()
          })
          db.close()
          console.log('Close the database connection.')
        })
      })
      .catch(reject => {
        return console.log('Ошибка работы с БД ---> ' + reject.message)
      })
  }

  static async renderFromDb () {
    let arrayNotes
    let arrayComments
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db".')
    })
      .then(db => {
        db.serialize(() => {
          arrayNotes = new Promise((resolve, reject) => {
            db.all('SELECT rowid AS id, * FROM notes', (err, arrayNotes) => {
              if (err) {
                reject(err)
              } else {
                resolve(arrayNotes)
              }
            })
          })
          arrayComments = new Promise((resolve, reject) => {
            db.all('SELECT rowid AS id, * FROM comments', (err, arrayComments) => {
              if (err) {
                reject(err)
              } else {
                resolve(arrayComments)
              }
            })
          })
        })
        db.close()
        console.log('Close the database connection.')
        return Promise.all([arrayNotes, arrayComments])
          .then(([arrayNotes, arrayComments]) => {
            let notes = arrayNotes.map(note => {
              note.comments = arrayComments.filter(comment => {
                if (comment.postId == note.id) {
                  return comment
                }
              })
              return note
            })
            return notes
          })
          .catch((reject) => {
            return console.log('Не удалось закрыть или прочитать БД---> ' + reject.message)
          })
          .catch(reject => {
            return console.log('Не удалось соедениться с БД ---> ' + reject.message)
          })
      })
  }
}

class Users {
  constructor (name, dateBirthday, email, telephone) {
    this.name = name
    this.dateBirthday = dateBirthday
    this.email = email
    this.telephone = telephone
  }
}
module.exports = { Notes, Users }
