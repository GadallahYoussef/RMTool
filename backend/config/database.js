const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'rmtool.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database schema
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Assets table
      db.run(`
        CREATE TABLE IF NOT EXISTS assets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          owner TEXT,
          criticality INTEGER CHECK(criticality >= 1 AND criticality <= 5),
          value REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Threats table
      db.run(`
        CREATE TABLE IF NOT EXISTS threats (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Vulnerabilities table
      db.run(`
        CREATE TABLE IF NOT EXISTS vulnerabilities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Risks table
      db.run(`
        CREATE TABLE IF NOT EXISTS risks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset_id INTEGER NOT NULL,
          threat_id INTEGER NOT NULL,
          vulnerability_id INTEGER NOT NULL,
          likelihood INTEGER CHECK(likelihood >= 1 AND likelihood <= 5),
          impact INTEGER CHECK(impact >= 1 AND impact <= 5),
          risk_score INTEGER,
          risk_level TEXT,
          description TEXT,
          status TEXT DEFAULT 'Active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
          FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE,
          FOREIGN KEY (vulnerability_id) REFERENCES vulnerabilities(id) ON DELETE CASCADE
        )
      `);

      // Treatments table
      db.run(`
        CREATE TABLE IF NOT EXISTS treatments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          risk_id INTEGER NOT NULL,
          treatment_type TEXT NOT NULL CHECK(treatment_type IN ('Mitigate', 'Accept', 'Transfer', 'Avoid')),
          description TEXT,
          owner TEXT,
          due_date DATE,
          status TEXT DEFAULT 'Planned' CHECK(status IN ('Planned', 'In Progress', 'Completed')),
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (risk_id) REFERENCES risks(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Database tables initialized');
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDatabase };
