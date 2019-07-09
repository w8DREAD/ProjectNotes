const db = require('../db/database')
const control = require('./control')

class Handler {
  constructor () {

  }

  static saveDb (notes) {
    db.pushIn(notes)
    console.log('call write')
  }

  static async renderFromDb () {
    console.log('2')
    return db.renderFrom()
  }
}
module.exports = Handler
