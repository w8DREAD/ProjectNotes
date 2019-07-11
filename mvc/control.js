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
  static sendNoteInDb ({ tagsText, notesText }) {
    let notes = new GetNote(tagsText, notesText)
    handler.Notes.pushInNoteDb(notes)
  }
}

class Comment {
  constructor (postId = 0, comment, author) {
    this.postId = +postId
    this.comment = comment
    this.author = author
  }
  static sendCommentInDb (id, text) {
    let comment = new Comment(id, text, 'author')
    console.log(comment)
    handler.Notes.pushInCommentDb(comment)
  }
}

module.exports = { GetNote, Comment }
