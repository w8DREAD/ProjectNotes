

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
  return db.createTable('tags', {
    text: 'string',
    noteId: 'int',
  });
};

exports.down = function (db) {
  return db.dropTable('tags');
};

exports._meta = {
  version: 1,
};
