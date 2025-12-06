const express = require('express');
const router = express.Router();
const { generatePDFReport, generateExcelReport } = require('../utils/reportGenerator');

router.get('/pdf', async (req, res) => {
  try {
    await generatePDFReport(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/excel', async (req, res) => {
  try {
    await generateExcelReport(res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
