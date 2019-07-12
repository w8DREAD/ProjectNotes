const handler = require('./model')

class GetNote {
  constructor (tagsText, notesText, postId = 0, author = 'someBody') {
    this.id = postId
    this.tagsText = tagsText
    this.notesText = notesText
    this.author = author
    this.comments = []
  }
  static async forRendering () {
    return handler.Notes.renderFromDb()
  }
  static async sendNoteInDb ({ tagsText, notesText }) {
    let notes = new GetNote(tagsText, notesText)
    await handler.Notes.pushInNoteDb(notes)
    return console.log('push note complete')
  }
  static async deleteNote (id) {
    handler.Notes.deleteNoteFromDb(id)
  }
}

class Comment {
  constructor (postId = 0, comment, author) {
    this.postId = +postId
    this.comment = comment
    this.author = author
  }
  static async sendCommentInDb (id, text) {
    let comment = new Comment(id, text, 'author')
    await handler.Notes.pushInCommentDb(comment)
    return console.log('push comment complete')
  }
}

module.exports = { GetNote, Comment }
