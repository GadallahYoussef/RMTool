const { db } = require('../config/database');

// Get all vulnerabilities
exports.getAllVulnerabilities = (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM vulnerabilities WHERE 1=1';
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

// Get single vulnerability
exports.getVulnerabilityById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM vulnerabilities WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Vulnerability not found' });
    }
    res.json(row);
  });
};

// Create vulnerability
exports.createVulnerability = (req, res) => {
  const { name, description, category } = req.body;
  
  const query = 'INSERT INTO vulnerabilities (name, description, category) VALUES (?, ?, ?)';
  
  db.run(query, [name, description, category], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Vulnerability created successfully' });
  });
};

// Update vulnerability
exports.updateVulnerability = (req, res) => {
  const { id } = req.params;
  const { name, description, category } = req.body;
  
  const query = 'UPDATE vulnerabilities SET name = ?, description = ?, category = ? WHERE id = ?';
  
  db.run(query, [name, description, category, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vulnerability not found' });
    }
    res.json({ message: 'Vulnerability updated successfully' });
  });
};

// Delete vulnerability
exports.deleteVulnerability = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM vulnerabilities WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vulnerability not found' });
    }
    res.json({ message: 'Vulnerability deleted successfully' });
  });
};
