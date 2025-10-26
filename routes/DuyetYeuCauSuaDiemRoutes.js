// routes/DuyetYeuCauSuaDiemRoutes.js
const express = require('express');
const router = express.Router();
const DuyetYeuCauSuaDiemController = require('../controllers/DuyetYeuCauSuaDiemController');

// Giao diện
router.get('/render', DuyetYeuCauSuaDiemController.renderPage);

// API xử lý dữ liệu
router.post('/getLopTheoKhoi', DuyetYeuCauSuaDiemController.getLopTheoKhoi);
router.post('/getRequests', DuyetYeuCauSuaDiemController.getRequests);
router.post('/updateStatus', DuyetYeuCauSuaDiemController.updateStatus);

module.exports = router;
