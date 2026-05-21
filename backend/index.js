require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('express').json;
const db = require('./db');

const authRoutes = require('./routes/auth');
const financesRoutes = require('./routes/finances');
const verifyToken = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(bodyParser());

app.use('/auth', authRoutes);
app.use('/finances', verifyToken, financesRoutes);

async function createTables() {
  const hasUsers = await db.schema.hasTable('users');
  if (!hasUsers) {
    await db.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique().notNullable();
      table.string('password_hash').notNullable();
      table.timestamps(true, true);
    });
  }

  const hasFinances = await db.schema.hasTable('finances');
  if (!hasFinances) {
    await db.schema.createTable('finances', table => {
      table.increments('id').primary();
      table.integer('user_id').notNullable();
      table.string('titulo');
      table.float('valor');
      table.string('vencimento');
      table.integer('parcelas');
      table.integer('parcela_atual');
      table.string('categoria');
      table.string('tipo');
      table.bigInteger('grupo_id');
      table.timestamps(true, true);
    });
  }
}

const port = process.env.PORT || 3000;

createTables().then(() => {
  app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to create tables', err);
  process.exit(1);
});
