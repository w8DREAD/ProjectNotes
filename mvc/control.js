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
    this.password = password
    this.email = email;
    this.telephone = telephone;
    this.dateBirthday = dateBirthday;
  }

  static create(user) {
    const newUser = new User(user.username, user.password, user.email, user.telephone, user.dateBirthday);
    handler.Users.takeFromDb();
    return handler.Users.pushInDb(newUser)
  }
}

class Note {
  constructor(tag, text, author = 'someBody', userId) {
    this.userId = userId
    this.tag = tag;
    this.text = text;
    this.author = author;
    this.date = formatDate();
    this.likes = 0
  }

  static async render() {
    let notes = await handler.Notes.takeFromDb();
    let comments = await handler.Comments.takeFromDb();
    let likes = await handler.Likes.takeFromDb();
    return notes.map(note => {
      let noteLikes = likes.filter(like => +like.noteId === note.id)
      console.log(noteLikes)
      note.likes = noteLikes.length
      note.comments = comments.filter(comment => comment.noteId === note.id)
      return note
    })
  }
  static create({ tagsText, notesText }) {
    const notes = new Note(tagsText, notesText );
    return handler.Notes.pushInDb(notes);
  }

  static delete(id) {
    handler.Likes.deleteFromDb(id)
    handler.Comments.deleteFromDb(id);
    handler.Notes.deleteFromDb(id);
  }

  static edit(text, id) {
    return handler.Notes.editInDb(text, id);
  }
}

class Comment {
  constructor(noteId = 1, text, author) {
    this.noteId = +noteId;
    this.text = text;
    this.author = author;
  }

  static create(id, text) {
    const comment = new Comment(id, text, 'author');
    return handler.Comments.pushInDb(comment);
  }
}

class Like {
  constructor(noteId, author) {
    this.noteId = noteId;
    this.author = author;
  }
  static async create({ noteId, author }) {
    const like = new Like( noteId, author);
    if(await this.check(like)) {
      await handler.Likes.pushInDb(like)
      return true
    } else {
      return false
    }

  }
  static check(like) {
    return handler.Likes.checkInDb(like)
  }
}
module.exports = {
  Note, Comment, Like, User,
};
