const express = require('express');
const router = express.Router();
const treatmentsController = require('../controllers/treatmentsController');

router.get('/', treatmentsController.getAllTreatments);
router.get('/stats', treatmentsController.getTreatmentStats);
router.get('/:id', treatmentsController.getTreatmentById);
router.post('/', treatmentsController.createTreatment);
router.put('/:id', treatmentsController.updateTreatment);
router.delete('/:id', treatmentsController.deleteTreatment);

module.exports = router;
