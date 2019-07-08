const Handler = require('./model')

class GetNote {
  constructor (tagsText, notesText, postId = 0) {
    this.id = postId
    this.tagsText = tagsText
    this.notesText = notesText
  }
  static async forRendering () {
    let data = await Handler.renderFromDb()
    console.log('1')
    return data
  }
  static async sendNoteInDb (request) {
    let notes = await new GetNote(request.tagsText, request.notesText)
    Handler.saveDb(notes)
  }
}

module.exports = GetNote
