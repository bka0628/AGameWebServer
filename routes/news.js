const express = require('express');

const newsController = require('../controllers/news');

const router = express.Router();

router.get('/', newsController.getNews);
router.get('/count', newsController.getTotalNewsCount);

router.get('/:id/prev-next', newsController.getPrevNextNewsById);
router.get('/:id', newsController.getNewsById);

module.exports = router;
