const { db } = require('../config/database');
const { calculateRiskScore, getRiskLevel } = require('../utils/riskCalculator');

// Get all risks with full details
exports.getAllRisks = (req, res) => {
  const { risk_level, status } = req.query;
  
  let query = `
    SELECT r.*, 
           a.name as asset_name, a.category as asset_category,
           t.name as threat_name, t.category as threat_category,
           v.name as vulnerability_name, v.category as vulnerability_category
    FROM risks r
    LEFT JOIN assets a ON r.asset_id = a.id
    LEFT JOIN threats t ON r.threat_id = t.id
    LEFT JOIN vulnerabilities v ON r.vulnerability_id = v.id
    WHERE 1=1
  `;
  const params = [];

  if (risk_level) {
    query += ' AND r.risk_level = ?';
    params.push(risk_level);
  }

  if (status) {
    query += ' AND r.status = ?';
    params.push(status);
  }

  query += ' ORDER BY r.risk_score DESC, r.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get single risk
exports.getRiskById = (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT r.*, 
           a.name as asset_name, a.category as asset_category,
           t.name as threat_name, t.category as threat_category,
           v.name as vulnerability_name, v.category as vulnerability_category
    FROM risks r
    LEFT JOIN assets a ON r.asset_id = a.id
    LEFT JOIN threats t ON r.threat_id = t.id
    LEFT JOIN vulnerabilities v ON r.vulnerability_id = v.id
    WHERE r.id = ?
  `;
  
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Risk not found' });
    }
    res.json(row);
  });
};

// Create risk
exports.createRisk = (req, res) => {
  const { asset_id, threat_id, vulnerability_id, likelihood, impact, description, status } = req.body;
  
  // Calculate risk score and level
  const risk_score = calculateRiskScore(likelihood, impact);
  const risk_level = getRiskLevel(risk_score);
  
  const query = `INSERT INTO risks 
                 (asset_id, threat_id, vulnerability_id, likelihood, impact, risk_score, risk_level, description, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [asset_id, threat_id, vulnerability_id, likelihood, impact, risk_score, risk_level, description, status || 'Active'], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      id: this.lastID, 
      risk_score, 
      risk_level,
      message: 'Risk created successfully' 
    });
  });
};

// Update risk
exports.updateRisk = (req, res) => {
  const { id } = req.params;
  const { asset_id, threat_id, vulnerability_id, likelihood, impact, description, status } = req.body;
  
  // Recalculate risk score and level
  const risk_score = calculateRiskScore(likelihood, impact);
  const risk_level = getRiskLevel(risk_score);
  
  const query = `UPDATE risks 
                 SET asset_id = ?, threat_id = ?, vulnerability_id = ?, 
                     likelihood = ?, impact = ?, risk_score = ?, risk_level = ?, 
                     description = ?, status = ?, updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`;
  
  db.run(query, [asset_id, threat_id, vulnerability_id, likelihood, impact, risk_score, risk_level, description, status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Risk not found' });
    }
    res.json({ 
      risk_score, 
      risk_level,
      message: 'Risk updated successfully' 
    });
  });
};

// Delete risk
exports.deleteRisk = (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM risks WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Risk not found' });
    }
    res.json({ message: 'Risk deleted successfully' });
  });
};

// Get risk statistics
exports.getRiskStats = (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM risks',
    byLevel: 'SELECT risk_level, COUNT(*) as count FROM risks GROUP BY risk_level',
    byStatus: 'SELECT status, COUNT(*) as count FROM risks GROUP BY status'
  };

  const stats = {};

  db.get(queries.total, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.total = row.count;

    db.all(queries.byLevel, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.byLevel = rows;

      db.all(queries.byStatus, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.byStatus = rows;
        res.json(stats);
      });
    });
  });
};
