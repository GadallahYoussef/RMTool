const { db } = require('../config/database');

// Get dashboard statistics
exports.getDashboardStats = (req, res) => {
  const stats = {};
  
  // Total assets
  db.get('SELECT COUNT(*) as count FROM assets', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalAssets = row.count;
    
    // Assets by category
    db.all('SELECT category, COUNT(*) as count FROM assets GROUP BY category', [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.assetsByCategory = rows;
      
      // Total risks
      db.get('SELECT COUNT(*) as count FROM risks', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.totalRisks = row.count;
        
        // Risks by level
        db.all('SELECT risk_level, COUNT(*) as count FROM risks GROUP BY risk_level', [], (err, rows) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.risksByLevel = rows;
          
          // Top 10 highest risks
          const topRisksQuery = `
            SELECT r.*, 
                   a.name as asset_name, 
                   t.name as threat_name, 
                   v.name as vulnerability_name
            FROM risks r
            LEFT JOIN assets a ON r.asset_id = a.id
            LEFT JOIN threats t ON r.threat_id = t.id
            LEFT JOIN vulnerabilities v ON r.vulnerability_id = v.id
            ORDER BY r.risk_score DESC, r.created_at DESC
            LIMIT 10
          `;
          
          db.all(topRisksQuery, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.topRisks = rows;
            
            // Treatment statistics
            db.all('SELECT status, COUNT(*) as count FROM treatments GROUP BY status', [], (err, rows) => {
              if (err) return res.status(500).json({ error: err.message });
              stats.treatmentsByStatus = rows;
              
              // Total treatments
              db.get('SELECT COUNT(*) as count FROM treatments', [], (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.totalTreatments = row.count;
                
                res.json(stats);
              });
            });
          });
        });
      });
    });
  });
};
