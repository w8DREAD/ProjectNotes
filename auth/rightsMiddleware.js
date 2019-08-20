const control = require('../mvc/control');
const asyncMw = require('./asyncMiddleware');

const rightsNoteTag = () => asyncMw(async (req, res, next) => {
  const noteId = Number(req.body.noteId);
  const userId = req.user.id;
  if (await control.Note.checkUser(noteId, userId)) {
    return next();
  }
  return res.sendStatus(401);
});

const rightsComment = () => asyncMw(async (req, res, next) => {
  const commentId = Number(req.params.id);
  const userId = req.user.id;
  if (await control.Comment.checkUser(commentId, userId)) {
    return next();
  }
  return res.sendStatus(401);
});

module.exports = {
  rightsNoteTag, rightsComment,
};
