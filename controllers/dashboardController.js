const db = require('../config/db');

exports.summary = async (req, res) => {
  try {
    const [r1] = await db.query('SELECT COUNT(*) AS c FROM customers');
    const [r2] = await db.query('SELECT COUNT(*) AS c FROM devices');
    const [r3] = await db.query('SELECT COUNT(*) AS c FROM repair_jobs');
    const [r4] = await db.query(
      "SELECT COUNT(*) AS c FROM repair_jobs WHERE status NOT IN ('completed','delivered','cancelled')"
    );
    const [r5] = await db.query(
      "SELECT COUNT(*) AS c FROM repair_jobs WHERE received_date = CURDATE()"
    );
    const [r6] = await db.query(
      "SELECT IFNULL(SUM(amount),0) AS c FROM payments WHERE status='paid'"
    );
    const [r7] = await db.query(
      "SELECT COUNT(*) AS c FROM payments WHERE status='pending'"
    );

    res.json({
      total_customers: r1[0].c,
      total_devices: r2[0].c,
      total_jobs: r3[0].c,
      active_jobs: r4[0].c,
      today_jobs: r5[0].c,
      total_revenue: r6[0].c,
      pending_payments: r7[0].c
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.report = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT s.name AS service_name,
             COUNT(j.id) AS job_count,
             IFNULL(SUM(CASE WHEN j.status IN ('completed','delivered')
               THEN COALESCE(j.final_cost, j.estimated_cost) ELSE 0 END),0) AS revenue
      FROM services s
      LEFT JOIN repair_jobs j ON j.service_id = s.id
      GROUP BY s.id
      ORDER BY revenue DESC
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.statusBreakdown = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT status, COUNT(*) AS count
      FROM repair_jobs GROUP BY status
    `);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
};