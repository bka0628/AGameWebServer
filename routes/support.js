const express = require('express');

const supportController = require('../controllers/support');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/inquiry', isAuth, supportController.createInquiries);
router.get('/inquiries', isAuth, supportController.getUserInquiries);
router.get('/inquiries/count', isAuth, supportController.getTotalInquiriesCount);

router.get('/:id', isAuth, supportController.getInquiriesById);
router.get('/:id/prev-next', isAuth, supportController.getPrevNextInquiriesById);

module.exports = router;