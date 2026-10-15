const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query('SELECT * FROM services ORDER BY id DESC');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM services WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const { name, description, category, price, estimated_hours } = data;
  const [r] = await db.query(
    'INSERT INTO services (name, description, category, price, estimated_hours) VALUES (?, ?, ?, ?, ?)',
    [name, description || null, category || 'hardware', price, estimated_hours || 1]
  );
  return r.insertId;
};

exports.update = async (id, data) => {
  const { name, description, category, price, estimated_hours, active } = data;
  await db.query(
    `UPDATE services SET name=?, description=?, category=?, price=?, estimated_hours=?, active=? WHERE id=?`,
    [name, description || null, category, price, estimated_hours, active ? 1 : 0, id]
  );
};

exports.remove = async (id) => {
  await db.query('DELETE FROM services WHERE id = ?', [id]);
};