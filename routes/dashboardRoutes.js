const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/summary', authenticate, ctrl.summary);
router.get('/report', authenticate, ctrl.report);
router.get('/status-breakdown', authenticate, ctrl.statusBreakdown);

module.exports = router;