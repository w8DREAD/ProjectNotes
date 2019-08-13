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
  db.runSql('CREATE TRIGGER updCommentsCountInsert AFTER INSERT ON comments\n'
    + 'BEGIN'
    + '    UPDATE notes SET comCount = (SELECT COUNT(*) \n'
    + '           FROM comments WHERE noteId = notes.id)\n'
    + '     WHERE id = NEW.noteId;'
    + 'END');
  db.runSql('CREATE TRIGGER updCommentsCountDelete AFTER DELETE ON notes\n'
    + 'BEGIN'
    + '    UPDATE notes SET comCount = (SELECT COUNT(*) \n'
    + '           FROM comments WHERE noteId = notes.id)\n'
    + '     WHERE id = OLD.id;'
    + 'END');
  return db.addColumn('notes', 'comCount', { type: 'int' });
};

exports.down = function (db) {
  db.runSql('DROP TRIGGER updCommentsCountInsert');
  db.runSql('DROP TRIGGER updCommentsCountDelete');
  db.dropTable('notes');
  return db.runSql('CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, text VARCHAR, date VARCHAR,\n'
    + 'userId INTEGER NOT NULL REFERENCES users (id), tags VARCHAR)');
};

exports._meta = {
  version: 1,
};
