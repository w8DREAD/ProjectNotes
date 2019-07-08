const Handler = require('./model')

class GetNote {
  constructor (tagsText, notesText, postId = 0) {
    this.id = postId
    this.tagsText = tagsText
    this.notesText = notesText
  }
  static forRendering () {
    return Handler.renderFromDb()
  }
  static sendNoteInDb (request) {
    let notes = new GetNote(request.tagsText, request.notesText)
    Handler.saveDb(notes)
  }
}

module.exports = { GetNote: GetNote }
