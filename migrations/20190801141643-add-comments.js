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
  return db.runSql('CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, text VARCHAR,\n'
    + 'noteId INTEGER REFERENCES notes (id) ON DELETE CASCADE NOT NULL, '
    + 'userId INTEGER REFERENCES users (id) NOT NULL)');
};

exports.down = function (db) {
  return db.dropTable('comments');
};

exports._meta = {
  version: 1,
};
