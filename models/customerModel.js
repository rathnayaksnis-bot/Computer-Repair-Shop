const db = require('../config/db');

exports.getAll = async (search = '') => {
  if (search) {
    const [rows] = await db.query(
      'SELECT * FROM customers WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? ORDER BY id DESC',
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    return rows;
  }
  const [rows] = await db.query('SELECT * FROM customers ORDER BY id DESC');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM customers WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { name, email, phone, address } = data;
  const [r] = await db.query(
    'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)',
    [name, email, phone, address || null]
  );
  return r.insertId;
};

exports.update = async (id, data) => {
  const { name, email, phone, address } = data;
  await db.query(
    'UPDATE customers SET name=?, email=?, phone=?, address=? WHERE id=?',
    [name, email, phone, address || null, id]
  );
};

exports.remove = async (id) => {
  await db.query('DELETE FROM customers WHERE id = ?', [id]);
};