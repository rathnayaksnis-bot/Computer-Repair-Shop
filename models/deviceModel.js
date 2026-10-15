const db = require('../config/db');

exports.getAll = async (customerId = '') => {
  let query = `
    SELECT d.*, c.name AS customer_name, c.phone AS customer_phone
    FROM devices d
    JOIN customers c ON d.customer_id = c.id
  `;
  const params = [];
  if (customerId) {
    query += ' WHERE d.customer_id = ?';
    params.push(customerId);
  }
  query += ' ORDER BY d.id DESC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query(
    `SELECT d.*, c.name AS customer_name FROM devices d
     JOIN customers c ON d.customer_id = c.id WHERE d.id = ?`, [id]
  );
  return rows[0];
};

exports.create = async (data) => {
  const { customer_id, device_type, brand, model, serial_number, purchase_date, notes } = data;
  const [r] = await db.query(
    `INSERT INTO devices (customer_id, device_type, brand, model, serial_number, purchase_date, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [customer_id, device_type, brand, model, serial_number || null, purchase_date || null, notes || null]
  );
  return r.insertId;
};

exports.update = async (id, data) => {
  const { customer_id, device_type, brand, model, serial_number, purchase_date, notes } = data;
  await db.query(
    `UPDATE devices SET customer_id=?, device_type=?, brand=?, model=?,
     serial_number=?, purchase_date=?, notes=? WHERE id=?`,
    [customer_id, device_type, brand, model, serial_number || null, purchase_date || null, notes || null, id]
  );
};

exports.remove = async (id) => {
  await db.query('DELETE FROM devices WHERE id = ?', [id]);
};