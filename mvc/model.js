const sqlite = require('sqlite3').verbose();


const openDb = () => Promise.resolve(new sqlite.Database('data.db'));

async function refreshComCount(db) {
  const notes = await selectFromTable(db, 'SELECT rowid AS id, * FROM notes');
  const comments = await selectFromTable(db, 'SELECT rowid AS id, * FROM comments');
  for (const item of notes) {
    const comCount = comments.filter(comment => comment.noteId === item.id);
    workWithTable(db, 'UPDATE notes SET comCount = ? WHERE rowid = ?', [comCount.length, item.id]);
  }
  return true;
}

async function refreshNotesCount(db) {
  const users = await selectFromTable(db, 'SELECT rowid AS id, * FROM users');
  const notes = await selectFromTable(db, 'SELECT rowid AS id, * FROM notes');
  for (const item of users) {
    const notesCount = notes.filter(note => note.userId === item.id);
    workWithTable(db, 'UPDATE users SET notesCount = ? WHERE rowid = ?', [notesCount.length, item.id]);
  }
  return true;
}

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
      .then(async (db) => {
        await workWithTable(db, 'INSERT INTO notes VALUES (?,?,?,?,?,?)', [note.tag, note.text, note.author, note.date, note.userId, 0]);
        await refreshNotesCount(db);
        closeDb(db);
        return true;
      })
      .catch(reject => console.log(`Заметки: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb(params) {
    return openDb()
      .then(async (db) => {
        const result = await selectFromTable(db, params);
        closeDb(db);
        return result;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }

  static deleteFromDb(id) {
    return openDb()
      .then(async (db) => {
        await selectFromTable(db, `DELETE FROM notes WHERE rowid = ${id}`);
        closeDb(db);
        return console.log('Удалено');
      })
      .catch(err => console.log(`Упс! Что-то пошло не так ---> ${err.message}`));
  }

  static editTextInDb(text, id) {
    openDb()
      .then(async (db) => {
        await workWithTable(db, 'UPDATE notes SET text = ? WHERE rowid = ?', [text, id]);
        closeDb(db);
        return console.log('Отредактировано');
      })
      .catch(err => console.log(`Упс! Не отредактировал ---> ${err.message}`));
  }

  static editTagInDb(text, id) {
    openDb()
      .then(async (db) => {
        await workWithTable(db, 'UPDATE notes SET tag = ? WHERE rowid = ?', [text, id]);
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
      .then(async (db) => {
        await workWithTable(db, 'INSERT INTO comments VALUES (?,?,?,?)', [comment.text, comment.author, comment.noteId, comment.userId]);
        const result = await selectFromTable(db, 'SELECT last_insert_rowid() AS id');
        await refreshComCount(db);
        closeDb(db);
        return result;
      })
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb(params) {
    return openDb()
      .then((db) => {
        const result = selectFromTable(db, params);
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
          const likeDb = likes.filter(dbLike => +dbLike.userId === +like.userId
              && +dbLike.noteId === +like.noteId);
          if (likeDb.length) {
            selectFromTable(db, `DELETE FROM likes WHERE rowid = ${likeDb[0].id}`);
            closeDb(db);
            return false;
          }
          return true;
        }));
  }

  static takeFromDb(params) {
    return openDb()
      .then(async (db) => {
        const result = await selectFromTable(db, params);
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
        workWithTable(db, 'INSERT INTO users VALUES (?,?,?,?,?.?)', [user.username, user.password, user.email, user.telephone, user.dateBirthday, 0]);
        closeDb(db);
        console.log('User registered');
        return true;
      })
      .catch(reject => console.log(`Комментарии: Ошибка работы с БД ---> ${reject.message}`));
  }

  static takeFromDb(params) {
    return openDb()
      .then((db) => {
        const result = selectFromTable(db, params);
        closeDb(db);
        return result;
      })
      .catch(err => console.log(`Не удалось закрыть или прочитать БД---> ${err.message}`));
  }
}
module.exports = {
  Notes, Comments, Likes, Users,
};
