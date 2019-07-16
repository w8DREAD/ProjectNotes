const handler = require('./model')

class GetNote {
  constructor (tag, text, author = 'someBody') {
    this.tag = tag
    this.text = text
    this.author = author
    this.comments = []
    this.like = []
  }
  static async forRendering () {
    handler.Notes.testDb()
    return handler.Notes.renderFromDb()
  }
  static async sendNoteInDb ({ tagsText, notesText }) {
    let notes = new GetNote(tagsText, notesText)
    return handler.Notes.pushInNoteDb(notes)
  }
  static async deleteNote (id) {
    return handler.Notes.deleteNoteFromDb(id)
  }
}

class Comment {
  constructor (noteId = 1, text, author) {
    this.noteId = +noteId
    this.text = text
    this.author = author
  }
  static async sendCommentInDb (id, text) {
    let comment = new Comment(id, text, 'author')
    return handler.Notes.pushInCommentDb(comment)
  }
}

module.exports = { GetNote, Comment }
