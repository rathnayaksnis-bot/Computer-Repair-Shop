const Payment = require('../models/paymentModel');

exports.list = async (req, res) => {
  try { res.json(await Payment.getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { job_id, amount } = req.body;
    if (!job_id || !amount) return res.status(400).json({ error: 'Missing fields' });
    const result = await Payment.create({
      job_id, amount,
      mode: req.body.mode || 'cash',
      status: req.body.status || 'pending'
    });
    res.status(201).json({ message: 'Payment recorded', ...result });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, mode } = req.body;
    await Payment.updateStatus(req.params.id, status, mode || 'cash');
    res.json({ message: 'Payment status updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};