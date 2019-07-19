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
  constructor(name, dateBirthday, email, telephone) {
    this.name = name;
    this.dateBirthday = dateBirthday;
    this.email = email;
    this.telephone = telephone;
  }
}

class Note {
  constructor(tag, text, author = 'someBody') {
    this.tag = tag;
    this.text = text;
    this.author = author;
    this.date = formatDate();
    this.usersLike = [author]
  }

  static pressLike(id, user) {
    if(this.usersLike.includes(user)) {

    }
  }

  static async render() {
   let notes = await handler.Notes.takeFromDb();
    let comments = await handler.Comments.takeFromDb();
      return notes.map(note => {
        note.comments = comments.filter(comment => comment.noteId === note.id)
        return note
      })
  }

  static create({ tagsText, notesText }) {
    const notes = new Note(tagsText, notesText);
    return handler.Notes.pushInDb(notes);
  }

  static delete(id) {
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
  constructor(noteId) {
    this.noteId = noteId;
    this.current = 0
    this.usersLikes = [];
  }
  static pressLike(user) {
    if(!this.usersLikes.includes(user)) {

    }
  }
}

module.exports = {
  Note, Comment, Like, User,
};
