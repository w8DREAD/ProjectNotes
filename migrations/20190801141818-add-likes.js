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
  return db.createTable('likes', {
    noteId: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'likesNote',
        table: 'notes',
        rules: {
          onDelete: 'CASCADE',
        },
        mapping: 'rowid',
      },
    },
    userId: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'likesUser',
        table: 'users',
        rules: {
          onDelete: 'CASCADE',
        },
        mapping: 'rowid',
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable('likes');
};

exports._meta = {
  version: 1,
};
