const express = require('express');
const router = express.Router();
const XemDiemHocKyController = require('../controllers/XemDiemHocKyController');

router.get('/render', XemDiemHocKyController.renderPage);
router.post('/api/xem-diem', XemDiemHocKyController.xemDiem);

module.exports = router;
