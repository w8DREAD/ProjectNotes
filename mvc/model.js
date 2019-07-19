const sqlite = require('sqlite3').verbose();

const openDb = () => Promise.resolve(new sqlite.Database('data.db'));

function selectFromTable(db, setupTable) {
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

function workWithTable(db, setupTable, data) {
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

function closeDb(db) {
  db.close();
  return console.log('Close the database connection.');
}

class Notes {
  static pushInDb(note) {
    return openDb()
      .then(db => new Promise((resolve) => {
        db.serialize(() => {
          workWithTable(db, 'CREATE TABLE IF NOT EXISTS comments (text TEXT NOT NULL, author TEXT NOT NULL, noteId INTEGER NOT NULL)');
          workWithTable(db, 'CREATE TABLE IF NOT EXISTS notes (tag TEXT NOT NULL, text TEXT NOT NULL, author TEXT NO NULL, date TEXT NO NULL, usersLike TEXT NO NULL)')
            .then((messageOk) => {
              workWithTable(db, 'INSERT INTO notes VALUES (?,?,?,?,?)', [note.tag, note.text, note.author, note.date, JSON.stringify(note.usersLike)]);
              closeDb(db);
              resolve(console.log(`Push note in Db - ${messageOk}`));
            });
        });
      }))
      .catch(reject => console.log(`Заметки: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb() {
    return new Promise(resolve => openDb()
      .then((db) => {
        selectFromTable(db, 'SELECT rowid AS id, * FROM notes')
          .then((arrayNotes) => {
            closeDb(db);
            resolve(arrayNotes);
          });
      }))
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static deleteFromDb(id) {
    return openDb()
      .then((db) => {
        selectFromTable(db, `DELETE FROM notes WHERE rowid = ${id}`);
        closeDb(db);
        return console.log('Удалено');
      })
      .catch(err => console.log(`Упс! Что-то пошло не так ---> ${err.message}`));
  }

  static editInDb(text, id) {
    openDb()
      .then((db) => {
        workWithTable(db, 'UPDATE notes SET text = ? WHERE rowid = ?', [text, id])
          .then(() => {
            closeDb(db);
            return console.log('Отредактировано');
          });
      })
      .catch(err => console.log(`Упс! Не отредактировал ---> ${err.message}`));
  }
}

class Comments {
  static pushInDb(comment) {
    return openDb()
      .then((db) => {
        workWithTable(db, 'INSERT INTO comments VALUES (?,?,?)', [comment.text, comment.author, comment.noteId]);
        closeDb(db);
        return console.log('Push comment in Db');
      })
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb() {
    return new Promise(resolve => openDb()
      .then((db) => {
        selectFromTable(db, 'SELECT rowid AS id, * FROM comments')
          .then((arrayComments) => {
            closeDb(db);
            resolve(arrayComments);
          });
      }))
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static deleteFromDb(id) {
    return openDb()
      .then((db) => {
        selectFromTable(db, `DELETE FROM comments WHERE noteId = ${id}`);
        closeDb(db);
        return console.log('Удалено');
      })
      .catch(err => console.log(`Упс! Что-то пошло не так ---> ${err.message}`));
  }
}

class Likes {

}
module.exports = { Notes, Comments, Likes };
