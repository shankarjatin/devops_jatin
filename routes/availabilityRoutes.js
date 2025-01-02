const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, availabilityController.addAvailability);
router.get('/:professorId', authMiddleware, availabilityController.getAvailability);

module.exports = router;