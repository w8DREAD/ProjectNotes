const {MongoClient} = require('mongodb');

const url = 'mongodb://localhost:27017/';
const mongoClient = new MongoClient(url, { useNewUrlParser: true });


async function take(db, collection) {
  mongoClient.connect((err, client) => {
    const mongodb = client.db(db);
    const mongoCollection = mongodb.collection(collection);
    if (err) return console.log(err);

    return mongoCollection.find().toArray((err, results) => {
      client.close();
      return results;
    });
  });
}

async function save(db, collection, data) {
  mongoClient.connect((err, client) => {
    const mongodb = client.db(db);
    const mongoCollection = mongodb.collection(collection);
    if (err) return console.log(err);

    return mongoCollection.insertMany(data, (err, results) => {
      client.close();
    });
  });
}
module.exports = {take, save};
