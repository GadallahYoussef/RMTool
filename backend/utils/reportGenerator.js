const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const { db } = require('../config/database');
const { getRiskColor } = require('./riskCalculator');

// Generate PDF Report
async function generatePDFReport(res) {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=risk-assessment-report.pdf');
  doc.pipe(res);

  // Title
  doc.fontSize(20).text('Risk Assessment Report', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
  doc.moveDown(2);

  // Executive Summary
  doc.fontSize(16).text('Executive Summary', { underline: true });
  doc.moveDown();

  return new Promise((resolve, reject) => {
    // Get statistics
    db.get('SELECT COUNT(*) as count FROM assets', [], (err, assetCount) => {
      if (err) return reject(err);
      
      db.get('SELECT COUNT(*) as count FROM risks', [], (err, riskCount) => {
        if (err) return reject(err);
        
        db.all('SELECT risk_level, COUNT(*) as count FROM risks GROUP BY risk_level', [], (err, risksByLevel) => {
          if (err) return reject(err);

          doc.fontSize(12);
          doc.text(`Total Assets: ${assetCount.count}`);
          doc.text(`Total Risks: ${riskCount.count}`);
          doc.moveDown();
          
          doc.text('Risks by Level:');
          risksByLevel.forEach(level => {
            doc.text(`  ${level.risk_level}: ${level.count}`);
          });
          doc.moveDown(2);

          // Asset Inventory
          doc.fontSize(16).text('Asset Inventory', { underline: true });
          doc.moveDown();

          db.all('SELECT * FROM assets ORDER BY criticality DESC', [], (err, assets) => {
            if (err) return reject(err);

            doc.fontSize(10);
            assets.forEach((asset, index) => {
              if (index > 0) doc.moveDown(0.5);
              doc.text(`${index + 1}. ${asset.name} (${asset.category}) - Criticality: ${asset.criticality}/5`);
              if (asset.description) {
                doc.fontSize(9).text(`   ${asset.description}`, { indent: 20 });
                doc.fontSize(10);
              }
            });
            doc.moveDown(2);

            // Risk Register
            doc.addPage();
            doc.fontSize(16).text('Risk Register', { underline: true });
            doc.moveDown();

            const riskQuery = `
              SELECT r.*, a.name as asset_name, t.name as threat_name, v.name as vulnerability_name
              FROM risks r
              LEFT JOIN assets a ON r.asset_id = a.id
              LEFT JOIN threats t ON r.threat_id = t.id
              LEFT JOIN vulnerabilities v ON r.vulnerability_id = v.id
              ORDER BY r.risk_score DESC
            `;

            db.all(riskQuery, [], (err, risks) => {
              if (err) return reject(err);

              doc.fontSize(10);
              risks.forEach((risk, index) => {
                if (index > 0) doc.moveDown(0.5);
                doc.text(`${index + 1}. Asset: ${risk.asset_name}`);
                doc.text(`   Threat: ${risk.threat_name}`);
                doc.text(`   Vulnerability: ${risk.vulnerability_name}`);
                doc.text(`   Risk Score: ${risk.risk_score} (${risk.risk_level})`);
                doc.text(`   Likelihood: ${risk.likelihood}/5, Impact: ${risk.impact}/5`);
                if (risk.description) {
                  doc.fontSize(9).text(`   ${risk.description}`);
                  doc.fontSize(10);
                }
              });

              // Treatment Plan
              doc.addPage();
              doc.fontSize(16).text('Treatment Plan', { underline: true });
              doc.moveDown();

              const treatmentQuery = `
                SELECT t.*, r.risk_level, a.name as asset_name
                FROM treatments t
                LEFT JOIN risks r ON t.risk_id = r.id
                LEFT JOIN assets a ON r.asset_id = a.id
                ORDER BY t.status, t.due_date
              `;

              db.all(treatmentQuery, [], (err, treatments) => {
                if (err) return reject(err);

                doc.fontSize(10);
                treatments.forEach((treatment, index) => {
                  if (index > 0) doc.moveDown(0.5);
                  doc.text(`${index + 1}. Asset: ${treatment.asset_name}`);
                  doc.text(`   Treatment Type: ${treatment.treatment_type}`);
                  doc.text(`   Status: ${treatment.status}`);
                  if (treatment.owner) doc.text(`   Owner: ${treatment.owner}`);
                  if (treatment.due_date) doc.text(`   Due Date: ${treatment.due_date}`);
                  if (treatment.description) {
                    doc.fontSize(9).text(`   ${treatment.description}`);
                    doc.fontSize(10);
                  }
                });

                doc.end();
                resolve();
              });
            });
          });
        });
      });
    });
  });
}

// Generate Excel Report
async function generateExcelReport(res) {
  const workbook = new ExcelJS.Workbook();
  
  // Assets sheet
  const assetsSheet = workbook.addWorksheet('Assets');
  assetsSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Owner', key: 'owner', width: 20 },
    { header: 'Criticality', key: 'criticality', width: 15 },
    { header: 'Value', key: 'value', width: 15 },
    { header: 'Description', key: 'description', width: 40 }
  ];

  // Risks sheet
  const risksSheet = workbook.addWorksheet('Risks');
  risksSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Asset', key: 'asset_name', width: 30 },
    { header: 'Threat', key: 'threat_name', width: 30 },
    { header: 'Vulnerability', key: 'vulnerability_name', width: 30 },
    { header: 'Likelihood', key: 'likelihood', width: 12 },
    { header: 'Impact', key: 'impact', width: 12 },
    { header: 'Risk Score', key: 'risk_score', width: 12 },
    { header: 'Risk Level', key: 'risk_level', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Description', key: 'description', width: 40 }
  ];

  // Treatments sheet
  const treatmentsSheet = workbook.addWorksheet('Treatments');
  treatmentsSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Risk ID', key: 'risk_id', width: 10 },
    { header: 'Asset', key: 'asset_name', width: 30 },
    { header: 'Treatment Type', key: 'treatment_type', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Owner', key: 'owner', width: 20 },
    { header: 'Due Date', key: 'due_date', width: 15 },
    { header: 'Description', key: 'description', width: 40 }
  ];

  return new Promise((resolve, reject) => {
    // Get assets
    db.all('SELECT * FROM assets', [], (err, assets) => {
      if (err) return reject(err);
      assets.forEach(asset => assetsSheet.addRow(asset));

      // Get risks
      const riskQuery = `
        SELECT r.*, a.name as asset_name, t.name as threat_name, v.name as vulnerability_name
        FROM risks r
        LEFT JOIN assets a ON r.asset_id = a.id
        LEFT JOIN threats t ON r.threat_id = t.id
        LEFT JOIN vulnerabilities v ON r.vulnerability_id = v.id
        ORDER BY r.risk_score DESC
      `;

      db.all(riskQuery, [], (err, risks) => {
        if (err) return reject(err);
        risks.forEach(risk => risksSheet.addRow(risk));

        // Get treatments
        const treatmentQuery = `
          SELECT t.*, a.name as asset_name
          FROM treatments t
          LEFT JOIN risks r ON t.risk_id = r.id
          LEFT JOIN assets a ON r.asset_id = a.id
        `;

        db.all(treatmentQuery, [], (err, treatments) => {
          if (err) return reject(err);
          treatments.forEach(treatment => treatmentsSheet.addRow(treatment));

          // Style headers
          [assetsSheet, risksSheet, treatmentsSheet].forEach(sheet => {
            sheet.getRow(1).font = { bold: true };
            sheet.getRow(1).fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFD3D3D3' }
            };
          });

          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', 'attachment; filename=risk-assessment-data.xlsx');
          
          workbook.xlsx.write(res).then(() => {
            res.end();
            resolve();
          }).catch(reject);
        });
      });
    });
  });
}

module.exports = {
  generatePDFReport,
  generateExcelReport
};
