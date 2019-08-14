const sqlite = require('sqlite3').verbose();


const openDb = () => Promise.resolve(new sqlite.Database('data.db'));

async function run(queryfn) {
  const db = await openDb();
  db.get('PRAGMA foreign_keys = ON');
  const res = await queryfn(db);
  closeDb(db);
  return res;
}

class Db {
  static async takeFromDb(params) {
    return run(db => selectFromTable(db, params));
  }
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
    return run(db => workWithTable(db, 'INSERT INTO tags VALUES (?,?,?)', [tag.id, tag.noteId, tag.text]));
  }

  static deleteFromDb(id) {
    return run(db => selectFromTable(db, `DELETE FROM tags WHERE id = ${id}`));
  }
}

class Notes extends Db {
  static async pushInDb(note) {
    return run(db => workWithTable(db, 'INSERT INTO notes VALUES (?,?,?,?,?)', [note.id, note.text, note.date, note.userId, 0]));
  }

  static deleteFromDb(id) {
    return run(db => selectFromTable(db, `DELETE FROM notes WHERE id = ${id}`));
  }

  static editTextInDb(text, id) {
    return run(db => workWithTable(db, 'UPDATE notes SET text = ? WHERE id = ?', [text, id]));
  }

  static editTagInDb(text, id) {
    return run(db => workWithTable(db, 'UPDATE notes SET tag = ? WHERE id = ?', [text, id]));
  }
}

class Comments extends Db {
  static async pushInDb(comment) {
    await run(db => workWithTable(db, 'INSERT INTO comments VALUES (?,?,?,?)', [comment.id, comment.text, comment.noteId, comment.userId]));
    return run(db => selectFromTable(db, 'SELECT last_insert_id() AS id'));
  }

  static deleteFromDb(id) {
    return run(db => selectFromTable(db, `DELETE FROM comments WHERE id = ${id}`));
  }
}

class Likes extends Db {
  static pushInDb(like) {
    return run(db => workWithTable(db, 'INSERT INTO likes VALUES (?,?)', [like.noteId, like.userId]));
  }

  static async raitingAllUsers(num = 0) {
    const result = [];
    let notes = [];
    const usersWithLikes = [];
    if (num) {
      const fromDb = await run(db => selectFromTable(db, 'SELECT * FROM notes'));
      notes = fromDb.reverse().splice(0, num);
    } else {
      notes = await run(db => selectFromTable(db, 'SELECT * FROM notes'));
    }

    const users = await run(db => selectFromTable(db, 'SELECT * FROM users'));
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
    return run(db => workWithTable(db, 'INSERT INTO users VALUES (?,?,?,?,?,?,?,?)', [user.id, user.username, user.password, user.email, user.telephone, user.dateBirthday, 0, 0]));
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
