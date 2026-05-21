const fs = require('fs');
const knex = require('knex');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(dataDir, 'db.sqlite3')
  },
  useNullAsDefault: true
});

module.exports = db;
