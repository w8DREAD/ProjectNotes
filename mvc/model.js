const sqlite = require('sqlite3').verbose();

const openDb = async () => new sqlite.Database('data.db');

async function selectFromTable(db, setupTable) {
  return new Promise((resolve, reject) => {
    db.all(setupTable, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
async function createTable(db, setupTable, data) {
  return new Promise((resolve, reject) => {
    db.run(setupTable, data, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve('Ok');
      }
    });
  });
}

class Notes {
  constructor() {

  }

  static async pushInDb(note) {
    return openDb()
      .then((db) => {
        console.log(db);
        return new Promise((resolve, reject) => {
          db.serialize(() => {
            createTable(db, 'CREATE TABLE IF NOT EXISTS notes (tag TEXT NOT NULL, text TEXT NOT NULL, author TEXT NO NULL)');
            createTable(db, 'CREATE TABLE IF NOT EXISTS comments (text TEXT NOT NULL, author TEXT NOT NULL, noteId INTEGER NOT NULL)')
              .then((messageOk) => {
                createTable(db, 'INSERT INTO notes VALUES (?,?,?)', [note.tag, note.text, note.author]);
                db.close();
                resolve(console.log(`Push note in Db - ${messageOk}`));
              });
          });
        });
      })
      .catch(reject => console.log(`Заметки: Ошибка работы с БД ---> ${reject.message}`));
  }

  static async renderFromDb() {
    let arrayNotes;
    let arrayComments;
    return openDb()
      .then(async (db) => {
        arrayNotes = await selectFromTable(db, 'SELECT rowid AS id, * FROM notes');
        console.log(arrayNotes);
        arrayComments = await selectFromTable(db, 'SELECT rowid AS id, * FROM comments');
        db.close();
        console.log('Close the database connection.');
        console.log(arrayComments);
        const notes = arrayNotes.map((note) => {
          note.comments = arrayComments.filter(comment => comment.noteId == note.id);
          return note;
        });
        return notes;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static async deleteFromDb(id) {
    return openDb()
      .then((db) => {
        selectFromTable(db, `DELETE FROM notes WHERE rowid = ${id}`);
        selectFromTable(db, `DELETE FROM comments WHERE noteId = ${id}`);
        db.close();
        console.log('Close the database connection.');
        return console.log('Удалено');
      })
      .catch(err => console.log(`Упс! Что-то пошло не так ---> ${err.message}`));
  }

  static editInDb(text, id) {
    openDb()
      .then(async (db) => {
        createTable(db, 'UPDATE notes SET text = ? WHERE rowid = ?', [text, id])
          .then(() => {
            db.close();
            console.log('Close the database connection.');
            return console.log('Отредактировано');
          });
      })
      .catch(err => console.log(`Упс! Не отредактировал ---> ${err.message}`));
  }
}

class Comment {
  static async pushInDb(comment) {
    return openDb()
      .then(db => new Promise((resolve, reject) => {
        resolve(createTable(db, 'INSERT INTO comments VALUES (?,?,?)', [comment.text, comment.author, comment.noteId]));
      }))
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }
}

class Users {
  constructor(name, dateBirthday, email, telephone) {
    this.name = name;
    this.dateBirthday = dateBirthday;
    this.email = email;
    this.telephone = telephone;
  }
}
module.exports = { Notes, Users, Comment };
