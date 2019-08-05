const handler = require('./model');
const redis = require('../mongodb/redis');

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
    this.myLikes = 0;
  }

  static async create(user) {
    const newUser = new User(user.username, user.password,
      user.email, user.telephone, user.dateBirthday);
    const email = await handler.Users.takeFromDb(`SELECT rowid as id, * FROM users WHERE '${user.email}'`);
    if (email[0]) {
      return false;
    }
    return handler.Users.pushInDb(newUser);
  }

  static async countLikes(userId) {
    redis.save('myLikes', await handler.Likes.countLikes(userId));
    return true;
  }

  static async refreshLikeInDb(userId) {
    return handler.Users.refreshLike(userId);
  }
}

class Note {
  constructor(tag, text, author, userId) {
    this.userId = userId;
    this.tag = tag;
    this.text = text;
    this.author = author;
    this.date = formatDate();
    this.likes = 0;
  }

  static async render(userId) {
    console.log(await handler.Likes.raitingAllUsers());
    const notesFromDb = await handler.Notes.takeFromDb('SELECT rowid AS id, * FROM notes');
    const commentsFromDb = await handler.Comments.takeFromDb('SELECT rowid AS id, * FROM comments');
    const likesFromDb = await handler.Likes.takeFromDb('SELECT rowid AS id, * FROM likes');
    const notes = notesFromDb.map((arg) => {
      const note = arg;
      const noteLikes = likesFromDb.filter(like => +like.noteId === note.id);
      note.likes = noteLikes.length;
      note.comments = commentsFromDb.filter(comment => comment.noteId === note.id);
      return note;
    });
    for (const note of notes) {
      let author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE rowid = ${+note.userId}`);
      note.author = author[0].username;
      if (note.userId === userId) {
        note.root = true;
        if (note.comments.length) {
          for (const comment of note.comments) {
            author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE rowid = ${+comment.userId}`);
            comment.author = author[0].username;
            comment.root = true;
          }
        }
      }
      if (note.comments.length) {
        for (const comment of note.comments) {
          author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE rowid = ${+comment.userId}`);
          comment.author = author[0].username;
          if (comment.userId === userId) {
            comment.root = true;
          }
        }
      }
    }
    return notes;
  }

  static create(data) {
    const note = new Note(data.tagText, data.noteText, data.author, data.userId);
    return handler.Notes.pushInDb(note);
  }

  static delete(id) {
    handler.Likes.deleteFromDb(id);
    handler.Comments.deleteFromDb('noteId', id);
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

class Comment {
  constructor(noteId, text, author, userId) {
    this.userId = userId;
    this.noteId = noteId;
    this.text = text;
    this.author = author;
  }

  static create(dataComment) {
    const comment = new Comment(dataComment.id, dataComment.text,
      dataComment.author, dataComment.userId);
    return handler.Comments.pushInDb(comment);
  }

  static delete(id) {
    handler.Comments.deleteFromDb('rowid', id);
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

  static check(like) {
    return handler.Likes.checkInDb(like);
  }

  static takeRedis(prop) {
    return redis.take(prop);
  }
}
module.exports = {
  Note, Comment, Like, User,
};
