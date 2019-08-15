const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });

const dbo = new Promise((resolve, reject) => {
  mongoClient.connect((err, dbo) => {
    if (err) reject(err);
    resolve(dbo.db('usersdb'));
  });
});

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
async function save(collection, data) {
  const db = await dbo;
  db.collection(collection).insert(data, (err, res) => {
    if (err) throw err;
  });
}
//
// const update = (collection, where, newValue) => new Promise(async (resolve, reject) => {
//   const db = await dbo;
//   db.collection(collection).updateOne(where, { $set: newValue }, (err, res) => {
//     if (err) reject(err);
//     resolve(res);
//   });
// });
//
// async function drop(collection) {
//   const db = await dbo;
//   db.collection(collection).drop();
// }
//
module.exports = {
  // take, update, drop,
  save,
};
