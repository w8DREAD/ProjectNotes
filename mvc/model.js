const sqlite = require('sqlite3').verbose()

const openDb = async () => {
  return new sqlite.Database('data.db')
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
async function createTable (db, setupTable, data) {
  return new Promise((resolve, reject) => {
    db.run(setupTable, data, err => {
      if (err) {
        reject(err)
      } else {
        resolve('Ok')
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
      let noteId = comments[comments.length - 1].noteId
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

  static async pushInNoteDb (note) {
    return openDb()
      .then(db => {
        console.log(db)
        return new Promise((resolve, reject) => {
          db.serialize(() => {
            createTable(db, 'CREATE TABLE IF NOT EXISTS notes (tag TEXT NOT NULL, text TEXT NOT NULL, author TEXT NO NULL)')
            createTable(db, 'CREATE TABLE IF NOT EXISTS comments (text TEXT NOT NULL, author TEXT NOT NULL, noteId INTEGER NOT NULL)')
              .then(messageOk => {
                createTable(db, `INSERT INTO notes VALUES (?,?,?)`, [note.tag, note.text, note.author])
                db.close()
                return console.log(messageOk)
              })
          })
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
          db.run(`INSERT INTO comments VALUES (?,?,?)`, [comment.text, comment.author, comment.noteId], err => {
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
              console.log(arrayComments)
              let notes = arrayNotes.map(note => {
                note.comments = arrayComments.filter(comment => {
                  return comment.noteId == note.id
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
        db.all(`DELETE FROM comments WHERE postId = ${id}`, err => {
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
