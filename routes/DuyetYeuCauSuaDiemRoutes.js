const express = require('express');
const router = express.Router();
const DuyetYeuCauSuaDiemController = require('../controllers/DuyetYeuCauSuaDiemController');

// Giao diện
router.get('/render', DuyetYeuCauSuaDiemController.renderPage);

// API chi tiết và xử lý
router.get('/details/:id', DuyetYeuCauSuaDiemController.getRequestDetails);
router.post('/approve', DuyetYeuCauSuaDiemController.approveRequest);
router.post('/reject', DuyetYeuCauSuaDiemController.rejectRequest);

module.exports = router;
