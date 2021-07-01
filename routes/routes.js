const express = require('express');
const router = express.Router();
const users =  require('../controllers/users');
const auth = require('../midlewares/auth').Auth;
const verify = require('../midlewares/verify').Verify;

router.route('/').get(users.home);
router.route('/register/:id').get(users.renderReg);
router.route('/login').get(users.renderLog)
router.route('/register/:id').post(users.create);
router.route('/login').post(users.login)
router.route('/dashboard').get(auth,users.dashboard)
router.route('/admin').get(auth,verify,users.admin)
router.route('/admin').post(auth,verify,users.create_time)

module.exports = router;