module.exports = {
  auth: require('./middleware'),
  async: require('./asyncMiddleware'),
  rightsNoteTags: require('./rightsMiddleware').rightsNoteTags,
  rightsComments: require('./rightsMiddleware').rightsComments,

};
