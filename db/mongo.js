const MongoClient = require('mongodb').MongoClient;
const handler = require('../mvc/model');

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

const dbo = new Promise((resolve, reject) => mongoClient.connect((err, data) => {
  if (err) reject(err);
  resolve(data.db('usersdb'));
}));

async function save(data) {
  const db = await dbo;
  return db.collection('users').insertOne(data);
}

const update = async (where, newValue) => {
  const db = await dbo;
  return db.collection('users').updateOne(where, newValue);
};

module.exports = {
  save, update,
};
