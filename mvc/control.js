const handler = require('./model');

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
  }

  static async create(user) {
    const newUser = new User(user.username, user.password,
      user.email, user.telephone, user.dateBirthday);
    const email = await handler.Users.find(`email = '${user.email}'`);
    if (email[0]) {
      return false;
    }
    return handler.Users.pushInDb(newUser);
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
    const notesFromDb = await handler.Notes.takeFromDb();
    const commentsFromDb = await handler.Comments.takeFromDb();
    const likesFromDb = await handler.Likes.takeFromDb();
    const notes = notesFromDb.map((arg) => {
      const note = arg;
      const noteLikes = likesFromDb.filter(like => +like.noteId === note.id);
      note.likes = noteLikes.length;
      note.comments = commentsFromDb.filter(comment => comment.noteId === note.id);
      return note;
    });
    return notes.map((note) => {
      if (note.userId === userId) {
        note.root = true;
        const comments = note.comments.slice();
        note.comments = comments.map((com) => {
          com.root = true;
          return com;
        });
        return note;
      }
      const comments = note.comments.slice();
      note.comments = comments.map((com) => {
        if (com.userId === userId) {
          com.root = true;
          return com;
        }
        return com;
      });
      return note;
    });
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
      return true;
    }
    return false;
  }

  static check(like) {
    return handler.Likes.checkInDb(like);
  }
}
module.exports = {
  Note, Comment, Like, User,
};
