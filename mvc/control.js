const handler = require('./model');
const redis = require('../db/redis/redis');

const statistics = [];
setInterval(async () => {
  statistics.splice(0, 1);
}, 25000);

function formatDate() {
  const date = new Date();
  let dd = date.getDate();
  if (dd < 10) dd = `0${dd}`;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = `0${mm}`;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = `0${yy}`;

  const hh = date.getHours() % 100;
  if (yy < 10) yy = `0${yy}`;

  const min = date.getMinutes() % 100;
  if (yy < 10) yy = `0${yy}`;

  return `${dd}.${mm}.${yy} в ${hh}:${min}`;
}

class User {
  constructor(name, password, email, telephone, dateBirthday) {
    this.username = name;
    this.password = password;
    this.email = email;
    this.telephone = telephone;
    this.dateBirthday = dateBirthday;
    this.myLike = 0;
  }

  static async activity() {
    const users = await handler.Users.takeFromDb('SELECT * FROM users');
    for (const user of users) {
      user.activity = 1;
      for (const userId of statistics) {
        if (userId === user.id) user.activity += 1;
      }
      const activity = user.activity - 1;
      user.activity = Math.round((activity / user.activity) * 100) / 100;
    }
    return users;
  }

  static delete(id) {
    handler.Users.deleteFromDb(id);
  }

  static async create(user) {
    const newUser = new User(user.username, user.password,
      user.email, user.telephone, user.dateBirthday);
    const email = await handler.Users.takeFromDb(`SELECT * FROM users WHERE email = '${user.email}'`);
    if (email[0]) {
      return false;
    }
    return handler.Users.pushInDb(newUser);
  }

  static async redisLike(user) {
    const likesCount = await handler.Likes.takeFromDb(`SELECT COUNT(*) AS count FROM likes WHERE noteId IN (SELECT id FROM notes WHERE userId = ${user.id})`);
    const likes = await redis.hgetall('likes');
    console.log(likes);
    await redis.hset('likes', `${user.email}`, likesCount[0].count);
    return true;
  }
}

class Note {
  constructor(text, userId) {
    this.userId = userId;
    this.text = text;
    this.date = formatDate();
    this.like = 0;
  }

  static async reproduce() {
    const notesFromDb = await handler.Notes.takeFromDb('SELECT * FROM notes');
    for (const note of notesFromDb) {
      const tags = await handler.Tags.takeFromDb(`SELECT * FROM tags WHERE noteId = ${note.id}`);
      const author = await handler.Users.takeFromDb(`SELECT username FROM users WHERE id = ${note.userId}`);
      const likes = await handler.Likes.takeFromDb(`SELECT COUNT(*) AS count FROM likes WHERE noteId = ${note.id}`);
      note.tag = tags.reverse();
      note.comments = await handler.Comments.takeFromDb(`SELECT * FROM comments WHERE noteId = ${note.id}`);
      note.author = author[0].username;
      note.likes = likes[0].count;
    }
    return notesFromDb;
  }

  static create(data) {
    const note = new Note(data.text, data.userId);
    return handler.Notes.pushInDb(note);
  }

  static async checkUser(noteId, userId) {
    const note = await handler.Notes.takeFromDb(`SELECT count(*) AS count FROM notes WHERE id = ${noteId} AND userId = ${userId}`);
    if (note[0].count) {
      return true;
    }
    return false;
  }

  static delete(id) {
    handler.Notes.deleteFromDb(id);
  }

  static edit(text, id) {
    if (text.noteText) {
      return handler.Notes.editTextInDb(text.noteText, id);
    }
    if (text.tagText) {
      return handler.Notes.editTagInDb(text.tagText, id);
    }
  }
}

class Tag {
  constructor(noteId, text) {
    this.noteId = noteId;
    this.text = text;
  }

  static create(data) {
    const tag = new Tag(data.noteId, data.text);
    return handler.Tags.pushInDb(tag);
  }

  static delete(id) {
    handler.Tags.deleteFromDb(id);
  }
}

class Comment {
  constructor(noteId, text, userId) {
    this.userId = userId;
    this.noteId = noteId;
    this.text = text;
  }

  static create(dataComment) {
    const comment = new Comment(dataComment.id, dataComment.text, dataComment.userId);
    statistics.unshift(dataComment.userId);
    return handler.Comments.pushInDb(comment);
  }

  static delete(id) {
    handler.Comments.deleteFromDb(id);
  }

  static async checkUser(commentId, userId) {
    const noteId = await handler.Comments.takeFromDb(`SELECT noteId FROM comments WHERE id = ${commentId}`);
    const note = await handler.Notes.takeFromDb(`SELECT count(*) AS count FROM notes WHERE id = ${noteId[0].noteId} AND userId = ${userId}`);
    const comment = await handler.Comments.takeFromDb(`SELECT COUNT(*) AS count FROM comments WHERE id = ${commentId} AND userId = ${userId}`);
    if (note[0].count) {
      return true;
    }
    if (comment[0].count) {
      return true;
    }
    return false;
  }
}

class Like {
  constructor(noteId, userId) {
    this.noteId = noteId;
    this.userId = userId;
  }

  static async create({ noteId, user }) {
    const like = new Like(noteId, user.id);
    const likeExists = await handler.Likes.takeFromDb(`SELECT COUNT(*) AS count FROM likes WHERE noteId = ${noteId} AND userId = ${user.id}`);
    const whoseLike = await handler.Likes.takeFromDb(`SELECT * FROM users WHERE id IN (SELECT userId AS id FROM notes WHERE id = ${noteId})`);
    if (!likeExists[0].count) {
      await handler.Likes.pushInDb(like);
      await User.redisLike(whoseLike[0]);
      return true;
    }
    await handler.Likes.deleteFromDb(noteId, user.id);
    await User.redisLike(whoseLike[0]);
    return false;
  }

  static async raiting(latestNote) {
    return handler.Likes.raitingAllUsers(latestNote);
  }

  static takeRedis(prop) {
    return redis.hget('likes', prop);
  }
}
module.exports = {
  Note, Comment, Like, User, Tag,
};
