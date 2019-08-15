const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Error ${err}`);
});

function take(prop) {
  return new Promise((resolve, reject) => {
    client.get(prop, (err, value) => {
      if (err) {
        reject(`Что то случилось при чтении: ${err}`);
      }
      if (value) {
        resolve(value);
      }
      reject('Лайки не найдены.');
    });
  });
}

function save(prop, value) {
  return new Promise((resolve, reject) => {
    client.set(prop, value, (err) => {
      if (err) {
        console.log(`Что то случилось при записи: ${err}`);
        client.quit();
      }
      resolve(true);
    });
  });
}

module.exports = {save, take};
