const Device = require('../models/deviceModel');

exports.list = async (req, res) => {
  try {
    res.json(await Device.getAll(req.query.customer_id || ''));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const d = await Device.getById(req.params.id);
    if (!d) return res.status(404).json({ error: 'Device not found' });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer_id, device_type, brand, model } = req.body;
    if (!customer_id || !device_type || !brand || !model) {
      return res.status(400).json({ error: 'Required fields missing' });
    }
    const id = await Device.create(req.body);
    res.status(201).json({ message: 'Device created', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Device.update(req.params.id, req.body);
    res.json({ message: 'Device updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Device.remove(req.params.id);
    res.json({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};