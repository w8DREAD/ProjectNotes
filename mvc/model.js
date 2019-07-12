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
            db.run('CREATE TABLE IF NOT EXISTS comments (comment TEXT, author TEXT, postId INTEGER )', err => {
              if (err) {
                reject(err)
              }
            })
            db.run('CREATE TABLE IF NOT EXISTS notes_comments (comments_id INTEGER NOT NULL, notes_id INTEGER NOT NULL,' +
                'FOREIGN KEY (comments_id) REFERENCES comments(id) ON DELETE CASCADE ' +
                'FOREIGN KEY (notes_id) REFERENCES notes(id) ON DELETE CASCADE )', err => {
              if (err) {
                reject(err)
              }
            })
            let pushNote = db.prepare('INSERT INTO notes VALUES (?,?)', err => {
              if (err) {
                reject(err)
              }
            })
            pushNote.run(notes.tagsText, notes.notesText)
            pushNote.finalize()
          })
          db.close()
          console.log('Close the database connection.')
          resolve(console.log('Заметка сохранена'))
        })
      })
      .catch(reject => {
        return console.log('Заметки: Ошибка работы с БД ---> ' + reject.message)
      })
  }

  static async pushInCommentDb (comment) {
    let db
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db".')
    })
      .then(data => {
        db = data
        let pushComment = db.prepare('INSERT INTO comments VALUES (?,?,?)', err => {
          if (err) {
            console.log('errr')
            return (err)
          }
        })
        pushComment.run(comment.comment, comment.author, comment.postId)
        pushComment.finalize()
        db.close()
        console.log('Close the database connection.')
        return console.log('Комментарий сохранен')
      })
      .catch(reject => {
        return console.log('Комментарии: Ошибка работы с БД ---> ' + reject.message)
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
        return Promise.all([arrayNotes, arrayComments])
          .then(([arrayNotes, arrayComments]) => {
            if (arrayComments.length) {
              let notesId = arrayComments[0].postId
              console.log(arrayComments)
              let commentId = arrayComments.reverse()[0].id
              let relation = db.prepare('INSERT INTO notes_comments VALUES (?,?)', err => {
                if (err) {
                  return (err)
                }
              })
              console.log('23123 = ' + commentId)
              relation.run(notesId, commentId)
              relation.finalize()
            }
            db.close()
            console.log('Close the database connection.')
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
  static async deleteNoteFromDb (id) {
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db".')
    })
      .then(db => {
        db.all(`DELETE FROM notes WHERE rowid = ${id}`, err => {
          if (err) {
            return err
          }
        })
        db.close()
        console.log('Close the database connection.')
        return console.log('Удалено')
      })
      .catch(reject => {
        return console.log('Упс! Что-то пошло не так ---> ' + reject.message)
      })
  }

  static testDb () {
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db" for comments_notes.')
    })
      .then(db => {
        console.log('123')
        db.all(`SELECT rowid AS id, * FROM notes_comments`, (err, data) => {
          if (err) {
            return console.log(err)
          }
          console.log(data)
          return data
        })
        db.close()
        console.log('Close the database connection.')
      })
      .catch(reject => {
        return console.log('Упс! Что-то пошло не так ---> ' + reject.message)
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
