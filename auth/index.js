module.exports = {
  auth: require('./middleware'),
  async: require('./asyncMiddleware'),
  rightsNoteTag: require('./rightsMiddleware').rightsNoteTag,
  rightsComment: require('./rightsMiddleware').rightsComment,

};
