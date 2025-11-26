const express = require('express');
const router = express.Router();
const XinPhepNghiHocController = require('../controllers/XinPhepNghiHocController');

router.get('/render', XinPhepNghiHocController.renderPage);
router.get('/api/danh-sach-con', XinPhepNghiHocController.getDanhSachCon);
router.post('/api/gui-don', XinPhepNghiHocController.guiDon);
router.get('/api/lich-su', XinPhepNghiHocController.getLichSuXinPhep);

module.exports = router;
