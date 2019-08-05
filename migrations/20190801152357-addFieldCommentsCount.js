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
  return db.addColumn('notes', 'comCount', { type: 'int' });
};

exports.down = function (db) {
  db.removeColumn('notes', 'comCount');
};

exports._meta = {
  version: 1,
};
