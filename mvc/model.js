const sqlite = require('sqlite3').verbose()

const test = [{ id: 1, tagsText: 'dasdasda', notesText: 'eqweqwesd' }, { id: 2, tagsText: 'vccvcvx', notesText: 'hgfhfghfgh' }, { id: 3, tagsText: 'yyyyyyyyyyy', notesText: 'ssssssssss' }]
let articles = []

class Notes {
  constructor () {

  }

  static async pushInDb (notes) {
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

  static async renderFromDb () {
    return new Promise(resolve => {
      let data = new sqlite.Database('data.db')
      resolve(data)
      console.log('Connected to the "data.db".')
    })
      .then(db => {
        return new Promise((resolve, reject) => {
          db.serialize(() => {
            db.all('SELECT rowid AS id, * FROM notes', (err, data) => {
              if (err) {
                reject(err)
              } else {
                resolve(data)
              }
            })
          })
          db.close()
          console.log('Close the database connection.')
        })
          .then(data => {
            return data
          })
          .catch((reject) => {
            return console.log('Не удалось закрыть или прочитать БД---> ' + reject.message)
          })
      })
      .catch(reject => {
        return console.log('Не удалось соедениться с БД ---> ' + reject.message)
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
