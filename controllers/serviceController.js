const Service = require('../models/serviceModel');

exports.list = async (req, res) => {
  try { res.json(await Service.getAll()); }
  catch (err) { res.status(500).json({ error: err.message }); }
};

exports.get = async (req, res) => {
  try {
    const s = await Service.getById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Service not found' });
    res.json(s);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
    const id = await Service.create(req.body);
    res.status(201).json({ message: 'Service created', id });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    await Service.update(req.params.id, req.body);
    res.json({ message: 'Service updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    await Service.remove(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};