const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.query(`
    SELECT p.*, j.job_number, j.final_cost, j.estimated_cost,
           c.name AS customer_name
    FROM payments p
    JOIN repair_jobs j ON p.job_id = j.id
    JOIN customers c ON j.customer_id = c.id
    ORDER BY p.id DESC
  `);
  return rows;
};

exports.create = async (data) => {
  const { job_id, amount, mode, status } = data;
  const ref = 'TXN-' + Date.now();
  const [r] = await db.query(
    `INSERT INTO payments (job_id, amount, mode, status, transaction_ref, paid_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [job_id, amount, mode, status, ref, status === 'paid' ? new Date() : null]
  );
  return { id: r.insertId, transaction_ref: ref };
};

exports.updateStatus = async (id, status, mode) => {
  await db.query(
    'UPDATE payments SET status=?, mode=?, paid_at=? WHERE id=?',
    [status, mode, status === 'paid' ? new Date() : null, id]
  );
};