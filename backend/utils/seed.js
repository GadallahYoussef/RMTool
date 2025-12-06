const { db, initDatabase } = require('../config/database');
const { calculateRiskScore, getRiskLevel } = require('./riskCalculator');

async function seedDatabase() {
  console.log('Initializing database...');
  await initDatabase();

  console.log('Seeding database with sample data...');

  // Sample Assets
  const assets = [
    ['Customer Database', 'Primary database containing customer information', 'Data', 'John Smith', 5, 500000],
    ['Web Application Server', 'Main production web server', 'Hardware', 'Jane Doe', 5, 50000],
    ['Employee Laptops', 'Standard issue laptops for employees', 'Hardware', 'IT Department', 3, 100000],
    ['CRM Software', 'Customer relationship management system', 'Software', 'Sales Team', 4, 25000],
    ['Network Firewall', 'Primary network security device', 'Hardware', 'Security Team', 5, 30000],
    ['HR Records System', 'Human resources management system', 'Data', 'HR Manager', 4, 75000],
    ['Backup Server', 'Off-site backup storage', 'Hardware', 'IT Department', 4, 40000],
    ['Email Server', 'Corporate email infrastructure', 'Software', 'IT Department', 5, 35000],
    ['Development Team', 'Software development personnel', 'Personnel', 'CTO', 5, 0],
    ['Data Center Facility', 'Primary data center location', 'Facilities', 'Operations Manager', 5, 1000000],
    ['Payment Gateway', 'Online payment processing system', 'Software', 'Finance Team', 5, 150000],
    ['Mobile App', 'Customer-facing mobile application', 'Software', 'Product Manager', 4, 80000]
  ];

  const assetPromises = assets.map(asset => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO assets (name, description, category, owner, criticality, value) VALUES (?, ?, ?, ?, ?, ?)',
        asset, function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
    });
  });

  const assetIds = await Promise.all(assetPromises);
  console.log(`Inserted ${assetIds.length} assets`);

  // Sample Threats
  const threats = [
    ['Malware Attack', 'Malicious software infection', 'Cyber'],
    ['Phishing Campaign', 'Social engineering via email', 'Cyber'],
    ['Insider Threat', 'Malicious or negligent employee action', 'Internal'],
    ['DDoS Attack', 'Distributed denial of service attack', 'Cyber'],
    ['Ransomware', 'Data encryption and extortion', 'Cyber'],
    ['Data Breach', 'Unauthorized access to sensitive data', 'Cyber'],
    ['Natural Disaster', 'Fire, flood, or earthquake', 'Physical'],
    ['Power Outage', 'Loss of electrical power', 'Physical'],
    ['Hardware Failure', 'Equipment breakdown or failure', 'Technical'],
    ['SQL Injection', 'Database exploitation attack', 'Cyber'],
    ['Zero-Day Exploit', 'Unknown vulnerability exploitation', 'Cyber'],
    ['Supply Chain Attack', 'Compromise through vendor/supplier', 'External'],
    ['Physical Theft', 'Unauthorized physical access and theft', 'Physical'],
    ['Social Engineering', 'Manipulation of personnel', 'Internal'],
    ['Password Attack', 'Brute force or credential stuffing', 'Cyber']
  ];

  const threatPromises = threats.map(threat => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO threats (name, description, category) VALUES (?, ?, ?)',
        threat, function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
    });
  });

  const threatIds = await Promise.all(threatPromises);
  console.log(`Inserted ${threatIds.length} threats`);

  // Sample Vulnerabilities
  const vulnerabilities = [
    ['Outdated Software', 'Unpatched systems and applications', 'Technical'],
    ['Weak Passwords', 'Insufficient password complexity', 'Configuration'],
    ['Lack of Encryption', 'Unencrypted data transmission or storage', 'Configuration'],
    ['No Backup System', 'Absence of data backup procedures', 'Process'],
    ['Inadequate Access Controls', 'Improper permission management', 'Configuration'],
    ['No Security Training', 'Untrained personnel', 'Process'],
    ['Single Point of Failure', 'No redundancy in critical systems', 'Design'],
    ['Insufficient Logging', 'Inadequate audit trails', 'Configuration'],
    ['No Network Segmentation', 'Flat network architecture', 'Design'],
    ['Lack of Monitoring', 'No real-time threat detection', 'Process'],
    ['Physical Access Gaps', 'Inadequate physical security', 'Physical'],
    ['Missing Data Classification', 'No data sensitivity labels', 'Process'],
    ['Poor Vendor Management', 'Inadequate third-party oversight', 'Process'],
    ['No Incident Response Plan', 'Lack of emergency procedures', 'Process'],
    ['Weak Authentication', 'No multi-factor authentication', 'Configuration']
  ];

  const vulnerabilityPromises = vulnerabilities.map(vuln => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO vulnerabilities (name, description, category) VALUES (?, ?, ?)',
        vuln, function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
    });
  });

  const vulnerabilityIds = await Promise.all(vulnerabilityPromises);
  console.log(`Inserted ${vulnerabilityIds.length} vulnerabilities`);

  // Sample Risks (creating realistic combinations)
  const risks = [
    [1, 1, 1, 4, 5, 'Customer database vulnerable to malware due to outdated software'],
    [1, 2, 3, 3, 5, 'Customer data exposed through phishing attacks due to lack of encryption'],
    [2, 4, 7, 3, 4, 'Web server could fail under DDoS with single point of failure'],
    [3, 3, 2, 2, 3, 'Employee laptops at risk from insider threat with weak passwords'],
    [4, 5, 1, 4, 4, 'CRM system vulnerable to ransomware due to outdated software'],
    [5, 10, 9, 3, 5, 'Firewall vulnerable to SQL injection with no network segmentation'],
    [6, 3, 5, 2, 4, 'HR records at risk from insider threat with inadequate access controls'],
    [7, 8, 4, 2, 4, 'Backup server vulnerable to power outage with no backup system'],
    [8, 1, 1, 4, 4, 'Email server at risk of malware due to outdated software'],
    [9, 14, 6, 3, 5, 'Development team vulnerable to social engineering with no security training'],
    [10, 7, 11, 2, 5, 'Data center at risk from natural disaster with physical access gaps'],
    [11, 6, 3, 5, 5, 'Payment gateway vulnerable to data breach due to lack of encryption'],
    [11, 15, 15, 4, 5, 'Payment gateway at risk from password attacks with weak authentication'],
    [12, 12, 13, 3, 4, 'Mobile app vulnerable to supply chain attack with poor vendor management'],
    [1, 11, 10, 4, 5, 'Customer database at risk from zero-day exploit with lack of monitoring'],
    [2, 9, 7, 3, 5, 'Web server could suffer hardware failure as single point of failure'],
    [5, 4, 9, 3, 4, 'Firewall could be overwhelmed by DDoS with no network segmentation'],
    [8, 2, 6, 3, 4, 'Email server vulnerable to phishing with no security training'],
    [10, 13, 11, 2, 5, 'Data center at risk from physical theft with physical access gaps'],
    [11, 10, 8, 5, 5, 'Payment gateway vulnerable to SQL injection with insufficient logging']
  ];

  for (const risk of risks) {
    const [asset_id, threat_id, vulnerability_id, likelihood, impact, description] = risk;
    const risk_score = calculateRiskScore(likelihood, impact);
    const risk_level = getRiskLevel(risk_score);
    
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO risks (asset_id, threat_id, vulnerability_id, likelihood, impact, risk_score, risk_level, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [asset_id, threat_id, vulnerability_id, likelihood, impact, risk_score, risk_level, description, 'Active'],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  console.log(`Inserted ${risks.length} risks`);

  // Sample Treatments
  const treatments = [
    [1, 'Mitigate', 'Implement regular software updates and patch management', 'IT Team', '2024-03-01', 'In Progress', 'Monthly patch schedule established'],
    [2, 'Mitigate', 'Deploy end-to-end encryption for all customer data', 'Security Team', '2024-02-15', 'Planned', 'Evaluating encryption solutions'],
    [3, 'Accept', 'Accept risk with monitoring', 'Operations', '2024-04-01', 'Completed', 'Risk within acceptable tolerance'],
    [4, 'Mitigate', 'Implement strong password policy and MFA', 'IT Security', '2024-02-20', 'In Progress', 'Password policy updated'],
    [5, 'Mitigate', 'Update antivirus and implement EDR solution', 'IT Team', '2024-03-15', 'Planned', 'Budget approved for EDR'],
    [6, 'Mitigate', 'Deploy WAF and implement input validation', 'Development Team', '2024-02-28', 'In Progress', 'WAF configuration underway'],
    [7, 'Mitigate', 'Implement role-based access control', 'IT Security', '2024-03-10', 'Planned', 'RBAC design in progress'],
    [8, 'Transfer', 'Purchase business continuity insurance', 'Finance', '2024-02-10', 'Completed', 'Policy active'],
    [11, 'Mitigate', 'Implement PCI DSS compliance measures', 'Security Team', '2024-04-01', 'In Progress', 'Phase 1 complete'],
    [12, 'Mitigate', 'Establish vendor security assessment program', 'Procurement', '2024-03-20', 'Planned', 'Criteria being defined'],
    [15, 'Mitigate', 'Deploy IDS/IPS and 24/7 monitoring', 'Security Operations', '2024-03-05', 'In Progress', 'IDS installed, tuning ongoing'],
    [20, 'Avoid', 'Disable vulnerable payment gateway features', 'Development Team', '2024-02-05', 'Completed', 'Non-essential features disabled']
  ];

  for (const treatment of treatments) {
    await new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO treatments (risk_id, treatment_type, description, owner, due_date, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
        treatment,
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  console.log(`Inserted ${treatments.length} treatments`);
  console.log('Database seeding completed successfully!');
}

// Run seeding
seedDatabase().catch(err => {
  console.error('Error seeding database:', err);
  process.exit(1);
});
