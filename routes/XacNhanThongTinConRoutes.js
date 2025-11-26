const express = require('express');
const router = express.Router();
const XacNhanThongTinConController = require('../controllers/XacNhanThongTinConController');

router.get('/render', XacNhanThongTinConController.renderPage);
router.get('/api/thong-tin', XacNhanThongTinConController.getThongTinCon);
router.post('/api/xac-nhan', XacNhanThongTinConController.xacNhanThongTin);
router.post('/api/chinh-sua', XacNhanThongTinConController.chinhSuaThongTin);

module.exports = router;
