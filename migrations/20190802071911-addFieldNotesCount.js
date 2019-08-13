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
  db.runSql('CREATE TRIGGER updNotesCountInsert AFTER INSERT ON notes\n'
    + 'BEGIN'
    + '    UPDATE users SET notesCount = (SELECT COUNT(*) \n'
    + '           FROM notes WHERE userId = users.id)\n'
    + '     WHERE id = NEW.userId;'
    + 'END');
  db.runSql('CREATE TRIGGER updNotesCountDelete AFTER DELETE ON notes\n'
    + 'BEGIN'
    + '    UPDATE users SET notesCount = (SELECT COUNT(*) \n'
    + '           FROM notes WHERE userId = users.id)\n'
    + '     WHERE id = OLD.userId;'
    + 'END');
  return db.addColumn('users', 'notesCount', { type: 'int' });
};

exports.down = function (db) {
  db.runSql('DROP TRIGGER updNotesCountInsert');
  db.runSql('DROP TRIGGER updNotesCountDelete');
  db.dropTable('users');
  return db.createTable('users', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    username: 'string',
    password: 'string',
    email: 'string',
    date: 'string',
    telephone: 'int',
    myLike: 'int',
  });
};

exports._meta = {
  version: 1,
};
