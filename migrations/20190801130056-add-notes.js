let dbm;
let type;
let seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  db.all('PRAGMA foreign_keys = ON');
  return db.runSql('CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text VARCHAR, date VARCHAR,\n'
    + 'userId INTEGER NOT NULL REFERENCES users (id))');
};

exports.down = function (db) {
  return db.dropTable('notes');
};

exports._meta = {
  version: 1,
};
