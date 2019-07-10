const handler = require('./model')

class GetNote {
  constructor (tagsText, notesText, postId = 0) {
    this.id = postId
    this.tagsText = tagsText
    this.notesText = notesText
    this.comments = []
  }
  static async forRendering () {
    console.log(await handler.Notes.renderFromDb())
    return handler.Notes.renderFromDb()
  }
  static sendNoteInDb ({ tagsText, notesText }) {
    let notes = new GetNote(tagsText, notesText)
    handler.Notes.pushInDb(notes)
  }
}

class Comment {
  constructor (comment, author) {
    this.comment = comment
    this.author = author
  }
}

module.exports = { GetNote }
