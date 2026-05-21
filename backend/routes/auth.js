const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const secret = process.env.JWT_SECRET || 'change-me';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const existing = await db('users').where({ username }).first();
  if (existing) return res.status(400).json({ error: 'User exists' });

  const hash = await bcrypt.hash(password, 10);
  const [id] = await db('users').insert({ username, password_hash: hash });

  const token = jwt.sign({ id }, secret, { expiresIn: '7d' });
  res.json({ token, user: { id, username } });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await db('users').where({ username }).first();
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id }, secret, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, username: user.username } });
});

module.exports = router;
