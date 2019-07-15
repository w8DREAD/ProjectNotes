const handler = require('./model')

class GetNote {
  constructor (tagsText, notesText, author = 'someBody') {
    this.tagsText = tagsText
    this.notesText = notesText
    this.author = author
    this.comments = []
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
  constructor (postId = 1, comment, author) {
    this.postId = +postId
    this.comment = comment
    this.author = author
  }
  static async sendCommentInDb (id, text) {
    let comment = new Comment(id, text, 'author')
    return handler.Notes.pushInCommentDb(comment)
  }
}

module.exports = { GetNote, Comment }
