const Job = require('../models/jobModel');
const Service = require('../models/serviceModel');

exports.list = async (req, res) => {
  try { res.json(await Job.getAll(req.query.status || '')); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const j = await Job.getById(req.params.id);
    if (!j) return res.status(404).json({ error: 'Job not found' });
    res.json(j);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { customer_id, device_id, service_id, problem_description, received_date } = req.body;
    if (!customer_id || !device_id || !service_id || !problem_description || !received_date)
      return res.status(400).json({ error: 'Required fields missing' });

    const service = await Service.getById(service_id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const job_number = await Job.generateJobNumber();
    const estimated_cost = service.price;

    const id = await Job.create({
      ...req.body, job_number, estimated_cost
    });
    res.status(201).json({ message: 'Job created', id, job_number, estimated_cost });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    await Job.update(req.params.id, req.body);
    res.json({ message: 'Job updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    await Job.updateStatus(req.params.id, req.body.status);
    res.json({ message: 'Job status updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Job.remove(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ============ SERVICE HISTORY ============
exports.history = async (req, res) => {
  try {
    res.json(await Job.getHistoryByCustomer(req.params.customerId));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ============ REPORTS ============
exports.report = async (req, res) => {
  try {
    const { from, to, status } = req.query;
    const rows = await Job.getReport(from, to, status);
    const summary = await Job.getReportSummary(from, to);
    res.json({ summary, rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.reportCSV = async (req, res) => {
  try {
    const { from, to, status } = req.query;
    const rows = await Job.getReport(from, to, status);

    let csv = 'Job No,Customer,Phone,Device,Service,Status,Priority,Estimated,Final,Received,Completed,Payment\n';
    rows.forEach(r => {
      const rec = r.received_date ? r.received_date.toString().split('T')[0] : '';
      const comp = r.completed_date ? r.completed_date.toString().split('T')[0] : '';
      csv += [
        r.job_number,
        `"${r.customer_name}"`,
        r.customer_phone,
        `"${r.device_brand} ${r.device_model}"`,
        `"${r.service_name}"`,
        r.status,
        r.priority,
        r.estimated_cost,
        r.final_cost || r.estimated_cost,
        rec,
        comp,
        r.payment_status || 'N/A'
      ].join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="repair-jobs-report-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) { res.status(500).json({ error: err.message }); }
};