const sqlite = require('sqlite3').verbose();


const openDb = () => Promise.resolve(new sqlite.Database('data.db'));

openDb()
  .then((db) => {
    db.serialize(() => {
      workWithTable(db, 'CREATE TABLE IF NOT EXISTS comments (text TEXT NOT NULL, author TEXT NOT NULL, noteId INTEGER NOT NULL, userId INTEGER NOT NULL)');
      workWithTable(db, 'CREATE TABLE IF NOT EXISTS notes (tag TEXT NOT NULL, text TEXT NOT NULL, author TEXT NO NULL, date TEXT NO NULL, userId INTEGER NOT NULL)');
      workWithTable(db, 'CREATE TABLE IF NOT EXISTS likes (noteId TEXT NOT NULL, userId TEXT NO NULL)');
      workWithTable(db, 'CREATE TABLE IF NOT EXISTS users (username TEXT NOT NULL, password TEXT NOT NULL, email TEXT NO NULL, telephone INTEGER NOT NULL, date TEXT)');
      closeDb(db);
    });
  });

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
      .then((db) => {
        workWithTable(db, 'INSERT INTO notes VALUES (?,?,?,?,?)', [note.tag, note.text, note.author, note.date, note.userId]);
        closeDb(db);
        return true;
      })
      .catch(reject => console.log(`Заметки: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb() {
    return openDb()
      .then((db) => {
        const result = selectFromTable(db, 'SELECT rowid AS id, * FROM notes');
        closeDb(db);
        return result;
      })
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

  static editTextInDb(text, id) {
    openDb()
      .then((db) => {
        workWithTable(db, 'UPDATE notes SET text = ? WHERE rowid = ?', [text, id]);
        closeDb(db);
        return console.log('Отредактировано');
      })
      .catch(err => console.log(`Упс! Не отредактировал ---> ${err.message}`));
  }

  static editTagInDb(text, id) {
    openDb()
      .then((db) => {
        workWithTable(db, 'UPDATE notes SET tag = ? WHERE rowid = ?', [text, id]);
        closeDb(db);
        return console.log('Отредактировано');
      })
      .catch(err => console.log(`Упс! Не отредактировал ---> ${err.message}`));
  }

  static editTagInDbff(text, id) {
    return run(db => workWithTable(db, 'UPDATE notes SET tag = ? WHERE rowid = ?', [text, id]));
  }
}

async function run(queryfn) {
  const db = await openDb();
  const res = await queryfn(db);
  closeDb(db);
  return res;
}

class Comments {
  static pushInDb(comment) {
    return openDb()
      .then((db) => {
        workWithTable(db, 'INSERT INTO comments VALUES (?,?,?,?)', [comment.text, comment.author, comment.noteId, comment.userId]);
        const result = selectFromTable(db, 'SELECT last_insert_rowid() AS id');
        closeDb(db);
        return result;
      })
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb() {
    return openDb()
      .then((db) => {
        const result = selectFromTable(db, 'SELECT rowid AS id, * FROM comments');
        closeDb(db);
        return result;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static deleteFromDb(field, id) {
    return openDb()
      .then((db) => {
        selectFromTable(db, `DELETE FROM comments WHERE ${field} = ${id}`);
        closeDb(db);
        return console.log('Удалено');
      })
      .catch(err => console.log(`Упс! Что-то пошло не так ---> ${err.message}`));
  }
}

class Likes {
  static pushInDb(like) {
    return openDb()
      .then((db) => {
        workWithTable(db, 'INSERT INTO likes VALUES (?,?)', [like.noteId, like.userId]);
        closeDb(db);
        return console.log('Push comment in Db');
      })
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }

  static checkInDb(like) {
    return openDb()
      .then(db => selectFromTable(db, 'SELECT rowid AS id, * FROM likes')
        .then((likes) => {
          const userId = likes.filter(dbLike => +dbLike.userId === +like.userId
            && dbLike.noteId === like.noteId);
          if (userId.length) {
            selectFromTable(db, `DELETE FROM likes WHERE noteId = ${like.noteId}`);
            closeDb(db);
            return false;
          }
          return true;
        }));
  }

  static takeFromDb() {
    return openDb()
      .then((db) => {
        const result = selectFromTable(db, 'SELECT rowid AS id, * FROM likes');
        closeDb(db);
        return result;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static deleteFromDb(id) {
    return openDb()
      .then((db) => {
        selectFromTable(db, `DELETE FROM likes WHERE noteId = ${id}`);
        closeDb(db);
        return console.log('Удалено');
      })
      .catch(err => console.log(`Упс! Что-то пошло не так ---> ${err.message}`));
  }
}

class Users {
  static pushInDb(user) {
    return openDb()
      .then((db) => {
        workWithTable(db, 'INSERT INTO users VALUES (?,?,?,?,?)', [user.username, user.password, user.email, user.telephone, user.dateBirthday]);
        closeDb(db);
        console.log('User registered');
        return true;
      })
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb() {
    return openDb()
      .then((db) => {
        const result = selectFromTable(db, 'SELECT rowid AS id, * FROM users');
        closeDb(db);
        return result;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static find(params) {
    return openDb()
      .then(async (db) => {
        const result = await selectFromTable(db, `SELECT rowid as id, * FROM users WHERE ${params}`);
        closeDb(db);
        return result;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }
}
module.exports = {
  Notes, Comments, Likes, Users,
};
