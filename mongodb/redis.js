const redis = require('redis');

const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Error ${err}`);
});

client.set('myLikes', 'Hello Redis', (err, repl) => {
  console.log(`123 = ${repl}`);
  if (err) {
    console.log(`Что то случилось при записи: ${err}`);
    client.quit();
  }
});
