const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.post('/logout', ctrl.logout);
router.get('/me', authenticate, ctrl.me);

module.exports = router;