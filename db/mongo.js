const MongoClient = require('mongodb').MongoClient;
const handler = require('../mvc/model');

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

const dbo = new Promise((resolve, reject) => mongoClient.connect((err, data) => {
  if (err) reject(err);
  resolve(data.db('usersdb'));
}));

// const take = (collection, findKey) => new Promise(async (resolve, reject) => {
//   const db = await dbo;
//   const mySort = { raiting: -1 };
//   db.collection(collection).find(findKey).sort(mySort).toArray((err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });
// });
//
//
async function save(data) {
  const db = await dbo;
  return new Promise((resolve, reject) => {
    db.collection('users').insertOne(data, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

const update = (where, newValue) => new Promise(async (resolve, reject) => {
  const db = await dbo;
  db.collection('users').updateOne(where, newValue, (err, res) => {
    if (err) reject(err);
    resolve(res);
  });
});
//
// async function drop(collection) {
//   const db = await dbo;
//   db.collection(collection).drop();
// }
//
module.exports = {
  // take,  drop,
  save, update,
};
