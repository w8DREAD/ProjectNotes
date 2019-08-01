const sqlite = require('sqlite3').verbose();

const openDb = () => Promise.resolve(new sqlite.Database('data.db'));

openDb()
  .then((db) => {
    db.migrate({force: 'last'});
  });
