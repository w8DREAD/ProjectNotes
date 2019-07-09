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
  static sendNoteInDb ({tagsText, notesText}) {
    let notes = new GetNote(tagsText, notesText)
    console.log('call call write')
    Handler.saveDb(notes)
  }
}

module.exports = GetNote
