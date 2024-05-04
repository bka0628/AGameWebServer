const express = require('express');

const downloadController = require('../controllers/download');

const router = express.Router();

router.get('/max', downloadController.getClientMax);
router.get('/whindo', downloadController.getClientWhindo);

module.exports = router;