const { db } = require('../config/database');

// Get all treatments
exports.getAllTreatments = (req, res) => {
  const { risk_id, status, treatment_type } = req.query;
  
  let query = `
    SELECT t.*, r.risk_level, r.risk_score,
           a.name as asset_name
    FROM treatments t
    LEFT JOIN risks r ON t.risk_id = r.id
    LEFT JOIN assets a ON r.asset_id = a.id
    WHERE 1=1
  `;
  const params = [];

  if (risk_id) {
    query += ' AND t.risk_id = ?';
    params.push(risk_id);
  }

  if (status) {
    query += ' AND t.status = ?';
    params.push(status);
  }

  if (treatment_type) {
    query += ' AND t.treatment_type = ?';
    params.push(treatment_type);
  }

  query += ' ORDER BY t.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get single treatment
exports.getTreatmentById = (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT t.*, r.risk_level, r.risk_score,
           a.name as asset_name
    FROM treatments t
    LEFT JOIN risks r ON t.risk_id = r.id
    LEFT JOIN assets a ON r.asset_id = a.id
    WHERE t.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Treatment not found' });
    }
    res.json(row);
  });
};

// Create treatment
exports.createTreatment = (req, res) => {
  const { risk_id, treatment_type, description, owner, due_date, status, notes } = req.body;
  
  const query = `INSERT INTO treatments 
                 (risk_id, treatment_type, description, owner, due_date, status, notes) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [risk_id, treatment_type, description, owner, due_date, status || 'Planned', notes], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Treatment created successfully' });
  });
};

// Update treatment
exports.updateTreatment = (req, res) => {
  const { id } = req.params;
  const { risk_id, treatment_type, description, owner, due_date, status, notes } = req.body;
  
  const query = `UPDATE treatments 
                 SET risk_id = ?, treatment_type = ?, description = ?, 
                     owner = ?, due_date = ?, status = ?, notes = ?,
                     updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
  
  db.run(query, [risk_id, treatment_type, description, owner, due_date, status, notes, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Treatment not found' });
    }
    res.json({ message: 'Treatment updated successfully' });
  });
};

// Delete treatment
exports.deleteTreatment = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM treatments WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Treatment not found' });
    }
    res.json({ message: 'Treatment deleted successfully' });
  });
};

// Get treatment statistics
exports.getTreatmentStats = (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM treatments',
    byStatus: 'SELECT status, COUNT(*) as count FROM treatments GROUP BY status',
    byType: 'SELECT treatment_type, COUNT(*) as count FROM treatments GROUP BY treatment_type'
  };

  const stats = {};

  db.get(queries.total, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.total = row.count;

    db.all(queries.byStatus, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.byStatus = rows;

      db.all(queries.byType, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.byType = rows;
        res.json(stats);
      });
    });
  });
};
