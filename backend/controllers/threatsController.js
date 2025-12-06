const { db } = require('../config/database');

// Get all threats
exports.getAllThreats = (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM threats WHERE 1=1';
  const params = [];

  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get single threat
exports.getThreatById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM threats WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Threat not found' });
    }
    res.json(row);
  });
};

// Create threat
exports.createThreat = (req, res) => {
  const { name, description, category } = req.body;
  
  const query = 'INSERT INTO threats (name, description, category) VALUES (?, ?, ?)';
  
  db.run(query, [name, description, category], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Threat created successfully' });
  });
};

// Update threat
exports.updateThreat = (req, res) => {
  const { id } = req.params;
  const { name, description, category } = req.body;
  
  const query = 'UPDATE threats SET name = ?, description = ?, category = ? WHERE id = ?';
  
  db.run(query, [name, description, category, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Threat not found' });
    }
    res.json({ message: 'Threat updated successfully' });
  });
};

// Delete threat
exports.deleteThreat = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM threats WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Threat not found' });
    }
    res.json({ message: 'Threat deleted successfully' });
  });
};
