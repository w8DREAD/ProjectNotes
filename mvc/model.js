const sqlite = require('sqlite3').verbose();


const openDb = () => Promise.resolve(new sqlite.Database('data.db'));

async function run(queryfn) {
  const db = await openDb();
  const res = await queryfn(db);
  closeDb(db);
  return res;
}

class Db {
  static async takeFromDb(params) {
    return run(db => selectFromTable(db, params));
  }
}

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
}
class Tags extends Db {
  static async pushInDb(tag) {
    await run(db => workWithTable(db, 'INSERT INTO tags VALUES (?,?)', [tag.text, tag.noteId]));
    return run(db => refreshNotesCount(db));
  }

  static deleteFromDb(noteId, tag) {
    return run(db => selectFromTable(db, `DELETE FROM tags WHERE noteId = ${noteId}, text = ${tag}`));
  }
}

class Notes extends Db {
  static async pushInDb(note) {
    await run(db => workWithTable(db, 'INSERT INTO notes VALUES (?,?,?,?,?)', [note.text, note.date, note.userId, '', 0]));
    return run(db => refreshNotesCount(db));
  }

  static deleteFromDb(id) {
    return run(db => selectFromTable(db, `DELETE FROM notes WHERE rowid = ${id}`));
  }

  static editTextInDb(text, id) {
    return run(db => workWithTable(db, 'UPDATE notes SET text = ? WHERE rowid = ?', [text, id]));
  }

  static editTagInDb(text, id) {
    return run(db => workWithTable(db, 'UPDATE notes SET tag = ? WHERE rowid = ?', [text, id]));
  }
}

class Comments extends Db {
  static async pushInDb(comment) {
    await run(db => workWithTable(db, 'INSERT INTO comments VALUES (?,?,?)', [comment.text, comment.noteId, comment.userId]));
    await run(db => refreshComCount(db));
    return run(db => selectFromTable(db, 'SELECT last_insert_rowid() AS id'));
  }

  static deleteFromDb(field, id) {
    return run(db => selectFromTable(db, `DELETE FROM comments WHERE ${field} = ${id}`));
  }
}

class Likes extends Db {
  static pushInDb(like) {
    return run(db => workWithTable(db, 'INSERT INTO likes VALUES (?,?)', [like.noteId, like.userId]));
  }

  static async checkInDb(like) {
    const likes = await run(db => selectFromTable(db, 'SELECT rowid AS id, * FROM likes'));
    const likeDb = likes.filter(dbLike => +dbLike.userId === +like.userId
              && +dbLike.noteId === +like.noteId);
    if (likeDb.length) {
      await run(db => selectFromTable(db, `DELETE FROM likes WHERE rowid = ${likeDb[0].id}`));
      return false;
    }
    return true;
  }

  static async countLikes(userId) {
    let result = 0;
    const notes = await run(db => selectFromTable(db, `SELECT rowid AS id FROM notes WHERE userId = ${userId}`));
    const likes = await run(db => selectFromTable(db, 'SELECT * FROM likes'));
    for (const item of notes) {
      const count = likes.filter(like => like.noteId === item.id);
      result += count.length;
    }
    return result;
  }

  static async raitingAllUsers(num = 0) {
    const result = [];
    let notes = [];
    const usersWithLikes = [];
    if (num) {
      const fromDb = await run(db => selectFromTable(db, 'SELECT rowid AS id, * FROM notes'));
      notes = fromDb.reverse().splice(0, num);
    } else {
      notes = await run(db => selectFromTable(db, 'SELECT rowid AS id, * FROM notes'));
    }

    const users = await run(db => selectFromTable(db, 'SELECT rowid AS id, * FROM users'));
    for (const user of users) {
      let likes = 0;
      for (const note of notes) {
        if (+note.userId === +user.id) {
          const like = await run(db => selectFromTable(db, `SELECT * FROM likes WHERE noteId = ${+note.id}`));
          likes += like.length;
        }
      }
      result.push(likes);
      user.myLike = likes;
      usersWithLikes.push(user);
    }
    const maxLikes = Math.max.apply(null, result);
    for (const user of usersWithLikes) {
      user.raiting = Math.round((user.myLike / maxLikes) * 100) || 0;
      // await mongo.update('users', {email: user.email}, user);
    }
    return usersWithLikes;
  }

  static deleteFromDb(id) {
    return run(db => selectFromTable(db, `DELETE FROM likes WHERE noteId = ${id}`));
  }
}

class Users extends Db {
  static pushInDb(user) {
    // mongo.save('users', user);
    return run(db => workWithTable(db, 'INSERT INTO users VALUES (?,?,?,?,?,?,?)', [user.username, user.password, user.email, user.telephone, user.dateBirthday, 0, 0]));
  }

  static async refreshLike(userId) {
    const likes = await Likes.countLikes(userId);
    return run(db => workWithTable(db, 'UPDATE users SET myLike = ? WHERE rowid = ?', [likes, userId]));
  }

  static giveNote(userId) {
    return run(db => selectFromTable(db, `SELECT * FROM notes WHERE userId = ${userId}`));
  }

  static async giveTags(userId, num = 0) {
    const tags = [];
    const notes = await this.giveNote(userId);
    for (const note of notes) {
      tags.push(note.tag);
    }
    if (num) {
      return tags.reverse().splice(0, num);
    }
    return tags.reverse();
  }
}
module.exports = {
  Notes, Comments, Likes, Users, Tags,
};
