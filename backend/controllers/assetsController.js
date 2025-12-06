const { db } = require('../config/database');

// Get all assets
exports.getAllAssets = (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM assets WHERE 1=1';
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

// Get single asset
exports.getAssetById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM assets WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(row);
  });
};

// Create asset
exports.createAsset = (req, res) => {
  const { name, description, category, owner, criticality, value } = req.body;
  
  const query = `INSERT INTO assets (name, description, category, owner, criticality, value) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [name, description, category, owner, criticality, value], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Asset created successfully' });
  });
};

// Update asset
exports.updateAsset = (req, res) => {
  const { id } = req.params;
  const { name, description, category, owner, criticality, value } = req.body;
  
  const query = `UPDATE assets 
                 SET name = ?, description = ?, category = ?, owner = ?, 
                     criticality = ?, value = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
  
  db.run(query, [name, description, category, owner, criticality, value, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset updated successfully' });
  });
};

// Delete asset
exports.deleteAsset = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM assets WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json({ message: 'Asset deleted successfully' });
  });
};
