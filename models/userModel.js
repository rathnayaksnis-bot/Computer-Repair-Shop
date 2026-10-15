const db = require('../config/db');

exports.findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

exports.create = async (username, email, password_hash, role = 'admin') => {
  const [r] = await db.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, password_hash, role]
  );
  return r.insertId;
};