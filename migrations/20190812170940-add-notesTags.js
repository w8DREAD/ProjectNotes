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
  db.runSql('CREATE TRIGGER updNotesTagsInsert AFTER INSERT ON tags\n'
    + 'BEGIN\n'
    + 'INSERT INTO notesTags (noteId, tagId) VALUES (NEW.noteId, NEW.id);\n'
    + 'END');
  return db.runSql('CREATE TABLE notesTags (noteId INTEGER REFERENCES notes (id) ON DELETE CASCADE NOT NULL,\n'
    + 'tagId INTEGER REFERENCES tags (id) ON DELETE CASCADE NOT NULL)');
};

exports.down = function (db) {
  db.runSql('DROP TRIGGER updNotesTagsInsert');
  return db.dropTable('notesTags');
};

exports._meta = {
  version: 1,
};
