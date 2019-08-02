const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });
const handler = require('../mvc/model');


async function users() {
  const users = await handler.Users.takeFromDb();
  const notes = await handler.Notes.takeFromDb();
  console.log(notes);
}

function qwe() {
  mongoClient.connect((err, client) => {
    const db = client.db('usersdb');
    const collection = db.collection('users');
    if (err) return console.log(err);

    collection.find().toArray((err, results) => {
      console.log(results);
      client.close();
    });
  });
}

module.exports = qwe;
