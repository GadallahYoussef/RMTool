import React from 'react';
import { reportsAPI } from '../../services/api';

const Reports = () => {
  const handleDownloadPDF = () => {
    reportsAPI.downloadPDF();
  };

  const handleDownloadExcel = () => {
    reportsAPI.downloadExcel();
  };

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>Export risk assessment data and reports</p>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3 className="card-title">📄 PDF Report</h3>
          <p style={{ margin: '20px 0', color: '#7f8c8d' }}>
            Generate a comprehensive risk assessment report including:
          </p>
          <ul style={{ marginLeft: '20px', color: '#7f8c8d' }}>
            <li>Executive summary</li>
            <li>Asset inventory</li>
            <li>Complete risk register</li>
            <li>Treatment plan</li>
          </ul>
          <button 
            className="btn btn-primary" 
            onClick={handleDownloadPDF}
            style={{ marginTop: '20px' }}
          >
            Download PDF Report
          </button>
        </div>

        <div className="card">
          <h3 className="card-title">📊 Excel Export</h3>
          <p style={{ margin: '20px 0', color: '#7f8c8d' }}>
            Export all data to Excel spreadsheet including:
          </p>
          <ul style={{ marginLeft: '20px', color: '#7f8c8d' }}>
            <li>Asset list with details</li>
            <li>Risk register with calculations</li>
            <li>Treatment tracking data</li>
          </ul>
          <button 
            className="btn btn-success" 
            onClick={handleDownloadExcel}
            style={{ marginTop: '20px' }}
          >
            Download Excel File
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Report Contents</h3>
        <div style={{ marginTop: '20px' }}>
          <h4>PDF Report Sections:</h4>
          <ol style={{ marginLeft: '20px', color: '#2c3e50' }}>
            <li><strong>Executive Summary</strong> - High-level overview of risk posture</li>
            <li><strong>Asset Inventory</strong> - Complete list of organizational assets</li>
            <li><strong>Risk Register</strong> - Detailed risk assessments with scores</li>
            <li><strong>Treatment Plan</strong> - Risk mitigation strategies and status</li>
          </ol>

          <h4 style={{ marginTop: '30px' }}>Excel Export Sheets:</h4>
          <ol style={{ marginLeft: '20px', color: '#2c3e50' }}>
            <li><strong>Assets</strong> - Full asset details with categorization</li>
            <li><strong>Risks</strong> - Risk register with likelihood, impact, and scores</li>
            <li><strong>Treatments</strong> - Treatment tracking with owners and due dates</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">💡 Tips</h3>
        <ul style={{ marginLeft: '20px', color: '#7f8c8d' }}>
          <li>PDF reports are ideal for presentations and documentation</li>
          <li>Excel exports allow for further analysis and custom reporting</li>
          <li>Both formats reflect the current state of your risk management data</li>
          <li>Generated reports can be shared with stakeholders and management</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;
