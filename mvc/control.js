const handler = require('./model');
const redis = require('../mongodb/redis');

const statistics = [];
setInterval(async () => {
  statistics.splice(0, 1);
}, 25000);

function formatDate() {
  const date = new Date();
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = `0${yy}`;

  const hh = date.getHours() % 100;
  if (yy < 10) yy = `0${yy}`;

  const min = date.getMinutes() % 100;
  if (yy < 10) yy = `0${yy}`;

  return `${dd}.${mm}.${yy} в ${hh}:${min}`;
}

class User {
  constructor(name, password, email, telephone, dateBirthday) {
    this.username = name;
    this.password = password;
    this.email = email;
    this.telephone = telephone;
    this.dateBirthday = dateBirthday;
    this.myLike = 0;
  }

  static async activity() {
    const users = await handler.Users.takeFromDb('SELECT * FROM users');
    for (const user of users) {
      user.activity = 1;
      for (const userId of statistics) {
        if (userId === user.id) user.activity += 1;
      }
      const activity = user.activity - 1;
      user.activity = Math.round((activity / user.activity) * 100) / 100;
    }
    return users;
  }

  static async giveTags(userId, num) {
    return handler.Users.giveTags(userId, num);
  }

  static async create(user) {
    const newUser = new User(user.username, user.password,
      user.email, user.telephone, user.dateBirthday);
    const email = await handler.Users.takeFromDb(`SELECT * FROM users WHERE '${user.email}'`);
    if (email[0]) {
      return false;
    }
    return handler.Users.pushInDb(newUser);
  }

  static async countLikes(userId) {
    redis.save('myLike', await handler.Likes.countLikes(userId));
    return true;
  }

  static async refreshLikeInDb(userId) {
    return handler.Users.refreshLike(userId);
  }
}

class Note {
  constructor(text, userId) {
    this.userId = userId;
    this.text = text;
    this.date = formatDate();
    this.like = 0;
  }

  static async reproduce(userId) {
    const notesFromDb = await handler.Notes.takeFromDb('SELECT (SELECT tag FROM tags WHERE tags.noteId = notes.id) AS tags, * FROM notes');
    console.log(await handler.Notes.takeFromDb('SELECT * FROM tags'));
    console.log(await handler.Notes.takeFromDb('SELECT * FROM comments'));
    console.log(notesFromDb);
    return notesFromDb;
    // const commentsFromDb = await handler.Comments.takeFromDb('SELECT rowid AS id, * FROM comments');
    // const likesFromDb = await handler.Likes.takeFromDb('SELECT rowid AS id, * FROM likes');
    // const notes = notesFromDb.map((arg) => {
    //   const note = arg;
    //   const noteLikes = likesFromDb.filter(like => +like.noteId === note.id);
    //   note.likes = noteLikes.length;
    //   note.comments = commentsFromDb.filter(comment => comment.noteId === note.id);
    //   return note;
    // });
    // for (const note of notes) {
    //   let author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE rowid = ${+note.userId}`);
    //   console.log(note);
    //   note.author = author[0].username;
    //   if (note.userId === userId) {
    //     note.root = true;
    //     if (note.comments.length) {
    //       for (const comment of note.comments) {
    //         author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE rowid = ${+comment.userId}`);
    //         comment.author = author[0].username;
    //         comment.root = true;
    //       }
    //     }
    //   }
    //   if (note.comments.length) {
    //     for (const comment of note.comments) {
    //       author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE rowid = ${+comment.userId}`);
    //       comment.author = author[0].username;
    //       if (comment.userId === userId) {
    //         comment.root = true;
    //       }
    //     }
    //   }
    // }
    // return notes;
  }

  static create(data) {
    const note = new Note(data.text, data.userId);
    return handler.Notes.pushInDb(note);
  }

  static delete(id) {
    handler.Notes.deleteFromDb(id);
  }

  static edit(text, id) {
    if (text.noteText) {
      return handler.Notes.editTextInDb(text.noteText, id);
    }
    if (text.tagText) {
      return handler.Notes.editTagInDb(text.tagText, id);
    }
  }
}

class Tag {
  constructor(noteId, text) {
    this.noteId = noteId;
    this.text = text;
  }

  static create(data) {
    const tag = new Tag(data.text, data.noteId);
    return handler.Tags.pushInDb(tag);
  }

  static delete(id) {
    handler.Comments.deleteFromDb('id', id);
  }
}

class Comment {
  constructor(noteId, text, userId) {
    this.userId = userId;
    this.noteId = noteId;
    this.text = text;
  }

  static create(dataComment) {
    const comment = new Comment(dataComment.id, dataComment.text, dataComment.userId);
    statistics.unshift(dataComment.userId);
    return handler.Comments.pushInDb(comment);
  }

  static delete(id) {
    handler.Comments.deleteFromDb('id', id);
  }
}

class Like {
  constructor(noteId, userId) {
    this.noteId = noteId;
    this.userId = userId;
  }

  static async create({ noteId, userId }) {
    const like = new Like(noteId, userId);
    if (await this.check(like)) {
      await handler.Likes.pushInDb(like);
      await User.countLikes(userId);
      return true;
    }
    await User.countLikes(userId);
    return false;
  }

  static async raiting(latestNote) {
    return handler.Likes.raitingAllUsers(latestNote);
  }

  static check(like) {
    return handler.Likes.checkInDb(like);
  }

  static takeRedis(prop) {
    return redis.take(prop);
  }
}
module.exports = {
  Note, Comment, Like, User, Tag,
};
