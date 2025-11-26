const express = require('express');
const router = express.Router();
const XacNhanNhapHocController = require('../controllers/XacNhanNhapHocController');

router.get('/render', XacNhanNhapHocController.renderPage);
router.post('/api/xac-nhan', XacNhanNhapHocController.xacNhan);

module.exports = router;
