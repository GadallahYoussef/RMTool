const express = require('express');
const router = express.Router();
const vulnerabilitiesController = require('../controllers/vulnerabilitiesController');

router.get('/', vulnerabilitiesController.getAllVulnerabilities);
router.get('/:id', vulnerabilitiesController.getVulnerabilityById);
router.post('/', vulnerabilitiesController.createVulnerability);
router.put('/:id', vulnerabilitiesController.updateVulnerability);
router.delete('/:id', vulnerabilitiesController.deleteVulnerability);

module.exports = router;
