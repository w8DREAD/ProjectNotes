const db = require('../db/database')
const control = require('./control')


class Handler {

  constructor() {

  }

  static async saveDb(notes) {
    db.pushIn(notes)
  }

  static async renderFromDb() {
    console.log('2')
    return await db.renderFrom()
  }
}
module.exports = Handler