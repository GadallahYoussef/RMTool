const express = require('express');
const router = express.Router();
const threatsController = require('../controllers/threatsController');

router.get('/', threatsController.getAllThreats);
router.get('/:id', threatsController.getThreatById);
router.post('/', threatsController.createThreat);
router.put('/:id', threatsController.updateThreat);
router.delete('/:id', threatsController.deleteThreat);

module.exports = router;
