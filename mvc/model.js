const sqlite = require('sqlite3').verbose()

const openDb = async () => {
  return new sqlite.Database('data.db')
}

async function selectFromTable (db, setupTable) {
  return new Promise((resolve, reject) => {
    db.all(setupTable, (err, data) => {
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
      let comments = await selectFromTable(db, 'SELECT rowid AS id, * FROM comments')
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
                resolve(console.log('Push note in Db - ' + messageOk))
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
          resolve(createTable(db, `INSERT INTO comments VALUES (?,?,?)`, [comment.text, comment.author, comment.noteId]))
        })
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
        arrayNotes = await selectFromTable(db, 'SELECT rowid AS id, * FROM notes')
        arrayComments = await selectFromTable(db, 'SELECT rowid AS id, * FROM comments')
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
      .catch((err) => {
        return console.log('Не удалось закрыть или прочитать БД---> ' + err.message)
      })
  }
  static async deleteNoteFromDb (id) {
    return openDb()
      .then(db => {
        selectFromTable(db, `DELETE FROM notes WHERE rowid = ${id}`)
        selectFromTable(db, `DELETE FROM comments WHERE noteId = ${id}`)
        db.close()
        console.log('Close the database connection.')
        return console.log('Удалено')
      })
      .catch(err => {
        return console.log('Упс! Что-то пошло не так ---> ' + err.message)
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
