const handler = require('./model');

class Note {
  constructor(tag, text, author = 'someBody') {
    this.tag = tag;
    this.text = text;
    this.author = author;
    this.comments = [];
    this.like = [];
  }

  static async forRendering() {
    return handler.Notes.renderFromDb();
  }

  static async create({ tagsText, notesText }) {
    const notes = new Note(tagsText, notesText);
    return handler.Notes.pushInDb(notes);
  }

  static async delete(id) {
    return handler.Notes.deleteFromDb(id);
  }

  static async edit(text, id) {
    return handler.Notes.editInDb(text, id);
  }
}

class Comment {
  constructor(noteId = 1, text, author) {
    this.noteId = +noteId;
    this.text = text;
    this.author = author;
  }

  static async create(id, text) {
    const comment = new Comment(id, text, 'author');
    return handler.Comment.pushInDb(comment);
  }
}

module.exports = { Note, Comment };
