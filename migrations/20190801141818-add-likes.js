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
  db.runSql('CREATE TABLE likes (noteId INTEGER REFERENCES notes (id) ON DELETE CASCADE NOT NULL,\n'
    + 'userId INTEGER NOT NULL REFERENCES users (id))');
  return db.runSql('CREATE INDEX idxLikes ON likes (noteId ASC, userId ASC);');
};

exports.down = function (db) {
  db.runSql('DROP INDEX idxLikes');
  return db.dropTable('likes');
};

exports._meta = {
  version: 1,
};
