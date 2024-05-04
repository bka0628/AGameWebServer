const express = require('express');

const newsController = require('../controllers/support');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/inquiries', isAuth, newsController.getUserInquiries);
router.post('/inquiry', isAuth, newsController.createInquiries);

module.exports = router;