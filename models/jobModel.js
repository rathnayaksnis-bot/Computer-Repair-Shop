const db = require('../config/db');

exports.getAll = async (status = '') => {
  let query = `
    SELECT j.*, c.name AS customer_name, c.phone AS customer_phone,
           d.brand AS device_brand, d.model AS device_model, d.device_type,
           s.name AS service_name
    FROM repair_jobs j
    JOIN customers c ON j.customer_id = c.id
    JOIN devices d ON j.device_id = d.id
    JOIN services s ON j.service_id = s.id
  `;
  const params = [];
  if (status) {
    query += ' WHERE j.status = ?';
    params.push(status);
  }
  query += ' ORDER BY j.id DESC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query('SELECT * FROM repair_jobs WHERE id = ?', [id]);
  return rows[0];
};

exports.generateJobNumber = async () => {
  const year = new Date().getFullYear();
  const [rows] = await db.query('SELECT COUNT(*) AS c FROM repair_jobs');
  const num = (rows[0].c + 1).toString().padStart(4, '0');
  return `JOB-${year}-${num}`;
};

exports.create = async (data) => {
  const { job_number, customer_id, device_id, service_id, problem_description, priority,
          estimated_cost, received_date, target_date } = data;
  const [r] = await db.query(
    `INSERT INTO repair_jobs (job_number, customer_id, device_id, service_id, problem_description,
     priority, estimated_cost, received_date, target_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [job_number, customer_id, device_id, service_id, problem_description,
     priority || 'medium', estimated_cost, received_date, target_date || null]
  );
  return r.insertId;
};

exports.update = async (id, data) => {
  const { customer_id, device_id, service_id, problem_description, status, priority,
          estimated_cost, final_cost, received_date, target_date, completed_date, technician_notes } = data;
  await db.query(
    `UPDATE repair_jobs SET customer_id=?, device_id=?, service_id=?, problem_description=?,
     status=?, priority=?, estimated_cost=?, final_cost=?, received_date=?, target_date=?,
     completed_date=?, technician_notes=? WHERE id=?`,
    [customer_id, device_id, service_id, problem_description, status, priority,
     estimated_cost, final_cost || null, received_date, target_date || null,
     completed_date || null, technician_notes || null, id]
  );
};

exports.updateStatus = async (id, status) => {
  const completedDate = ['completed', 'delivered'].includes(status) ? new Date() : null;
  await db.query(
    'UPDATE repair_jobs SET status=?, completed_date=COALESCE(?, completed_date) WHERE id=?',
    [status, completedDate, id]
  );
};

exports.remove = async (id) => {
  await db.query('DELETE FROM repair_jobs WHERE id = ?', [id]);
};

// ============ SERVICE HISTORY ============
exports.getHistoryByCustomer = async (customerId) => {
  const [rows] = await db.query(`
    SELECT j.*, s.name AS service_name, d.brand AS device_brand, d.model AS device_model,
           p.status AS payment_status, p.amount AS payment_amount
    FROM repair_jobs j
    JOIN services s ON j.service_id = s.id
    JOIN devices d ON j.device_id = d.id
    LEFT JOIN payments p ON p.job_id = j.id
    WHERE j.customer_id = ?
    ORDER BY j.received_date DESC
  `, [customerId]);
  return rows;
};

// ============ REPORTS ============
exports.getReport = async (from, to, status) => {
  let query = `
    SELECT j.id, j.job_number, c.name AS customer_name, c.phone AS customer_phone,
           d.brand AS device_brand, d.model AS device_model, d.device_type,
           s.name AS service_name, j.status, j.priority,
           j.estimated_cost, j.final_cost,
           j.received_date, j.completed_date,
           p.status AS payment_status, p.mode AS payment_mode, p.amount AS payment_amount
    FROM repair_jobs j
    JOIN customers c ON j.customer_id = c.id
    JOIN devices d ON j.device_id = d.id
    JOIN services s ON j.service_id = s.id
    LEFT JOIN payments p ON p.job_id = j.id
    WHERE 1=1
  `;
  const params = [];
  if (from) { query += ' AND j.received_date >= ?'; params.push(from); }
  if (to) { query += ' AND j.received_date <= ?'; params.push(to); }
  if (status) { query += ' AND j.status = ?'; params.push(status); }
  query += ' ORDER BY j.received_date DESC';
  const [rows] = await db.query(query, params);
  return rows;
};

exports.getReportSummary = async (from, to) => {
  let query = `
    SELECT
      COUNT(j.id) AS total_jobs,
      IFNULL(SUM(CASE WHEN j.status IN ('completed','delivered') THEN 1 ELSE 0 END),0) AS completed_jobs,
      IFNULL(SUM(CASE WHEN j.status NOT IN ('completed','delivered','cancelled') THEN 1 ELSE 0 END),0) AS active_jobs,
      IFNULL(SUM(CASE WHEN j.status = 'cancelled' THEN 1 ELSE 0 END),0) AS cancelled_jobs,
      IFNULL(SUM(CASE WHEN j.status IN ('completed','delivered') THEN COALESCE(j.final_cost, j.estimated_cost) ELSE 0 END),0) AS total_revenue
    FROM repair_jobs j
    WHERE 1=1
  `;
  const params = [];
  if (from) { query += ' AND j.received_date >= ?'; params.push(from); }
  if (to) { query += ' AND j.received_date <= ?'; params.push(to); }
  const [rows] = await db.query(query, params);
  return rows[0];
};