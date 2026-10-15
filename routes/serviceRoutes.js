const router = require('express').Router();
const ctrl = require('../controllers/serviceController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');

router.get('/', authenticate, ctrl.list);
router.get('/:id', authenticate, ctrl.get);
router.post('/', authenticate, authorizeAdmin, ctrl.create);
router.put('/:id', authenticate, authorizeAdmin, ctrl.update);
router.delete('/:id', authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;