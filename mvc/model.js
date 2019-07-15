const sqlite = require('sqlite3').verbose()

const openDb = async () => {
  return new Promise((resolve, reject) => {
    let data = new sqlite.Database('data.db', (err, data) => {
      if (err) {
        reject(err)
      } else {
        return data
      }
    })
    resolve(data)
    console.log('Connected to the "data.db".')
  })
}

async function selectFromTable (db, table) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT rowid AS id, * FROM ${table}`, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function relations () {
  openDb()
    .then(async db => {
      let comments = await selectFromTable(db, 'comments')
      let relation = db.prepare('INSERT INTO notes_comments VALUES (?,?)', err => {
        if (err) {
          return (err)
        }
      })
      let noteId = comments[comments.length - 1].postId
      let commentId = comments.length
      relation.run(commentId, noteId)
      relation.finalize()
      db.close()
      console.log('Close the database connection.')
      return console.log('Комментарий сохранен')
    })
}

class Notes {
  constructor () {

  }

  static async pushInNoteDb (notes) {
    return openDb()
      .then(db => {
        console.log(db)
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
          resolve('Заметка сохранена')
        })
          .then(messageOk => {
            db.close()
            return console.log(messageOk)
          })
      })
      .catch(reject => {
        return console.log('Заметки: Ошибка работы с БД ---> ' + reject.message)
      })
  }

  static async pushInCommentDb (comment) {
    return openDb()
      .then(db => {
        return new Promise((resolve, reject) => {
          db.run(`INSERT INTO comments VALUES (?,?,?)`, [comment.comment, comment.author, comment.postId], err => {
            if (err) {
              reject(err)
            }
            resolve('Complete')
          })
        })
          .then(() => {
            db.close()
            console.log('Close the database connection.')
            return relations()
          })
        // pushComment.run(comment.comment, comment.author, comment.postId)
        // pushComment.finalize()
      })
      .catch(reject => {
        return console.log('Комментарии: Ошибка работы с БД ---> ' + reject.message)
      })
  }

  static async renderFromDb () {
    let arrayNotes
    let arrayComments
    return openDb()
      .then(async db => {
        try {
          arrayNotes = await selectFromTable(db, 'notes')
          arrayComments = await selectFromTable(db, 'comments')
          return Promise.all([arrayNotes, arrayComments])
            .then(([arrayNotes, arrayComments]) => {
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
        } catch (err) {
          return console.log('Не удалось закрыть или прочитать БД---> ' + err.message)
        }
      })
  }
  static async deleteNoteFromDb (id) {
    return openDb()
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
    openDb()
      .then(async db => {
        return console.log(await selectFromTable(db, 'notes_comments'))
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
