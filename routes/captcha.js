const express = require('express');

const captchaController = require('../controllers/captcha');

const router = express.Router();

router.get('/', captchaController.getCaptcha);
router.get('/isCaptcha', captchaController.getIsCaptcha);

module.exports = router;