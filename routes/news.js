const express = require('express');

const newsController = require('../controllers/news');

const router = express.Router();

router.get('/all', newsController.getAllNews);
router.get('/notices', newsController.getNoticesNews);
router.get('/maintenance', newsController.getMaintenanceNews);
router.get('/updates', newsController.getUpdatesNews);
router.get('/count', newsController.getTotalNewsCount);

router.get('/:id', newsController.getNewsById);

module.exports = router;
