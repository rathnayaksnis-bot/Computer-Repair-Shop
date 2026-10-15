const Customer = require('../models/customerModel');

exports.list = async (req, res) => {
  try {
    res.json(await Customer.getAll(req.query.search || ''));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const c = await Customer.getById(req.params.id);
    if (!c) return res.status(404).json({ error: 'Customer not found' });
    res.json(c);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ error: 'Name, email, phone required' });
    const id = await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    await Customer.update(req.params.id, req.body);
    res.json({ message: 'Customer updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Customer.remove(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};