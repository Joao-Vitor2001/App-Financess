const fs = require('fs');
const knex = require('knex');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const dbFile = path.join(dataDir, 'db.sqlite3');

try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.closeSync(fs.openSync(dbFile, 'a'));
  console.log('SQLite data file verified:', dbFile);
} catch (err) {
  console.error('Failed to prepare SQLite data file:', dbFile, err);
  throw err;
}

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile
  },
  useNullAsDefault: true
});

module.exports = db;
