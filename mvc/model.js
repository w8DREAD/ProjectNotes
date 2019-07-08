const db = require('../db/database')

class Handler {
  constructor () {

  }

  static saveDb (notes) {
    db.pushIn(notes)
  }

  static renderFromDb () {
    return db.renderFrom()
  }
}

module.exports = Handler
