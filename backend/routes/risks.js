const express = require('express');
const router = express.Router();
const risksController = require('../controllers/risksController');

router.get('/', risksController.getAllRisks);
router.get('/stats', risksController.getRiskStats);
router.get('/:id', risksController.getRiskById);
router.post('/', risksController.createRisk);
router.put('/:id', risksController.updateRisk);
router.delete('/:id', risksController.deleteRisk);

module.exports = router;
