const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'change-me';

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });

  const parts = header.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid token' });

  const token = parts[1];

  try {
    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = verifyToken;
