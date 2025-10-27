const express = require('express');
const router = express.Router();
const DuyetController = require('../controllers/DuyetYeuCauSuaDiemController');

router.get('/render', DuyetController.renderPage);
router.get('/details/:id', DuyetController.getRequestDetails);
router.post('/list', DuyetController.getRequestsByStatus);
router.post('/approve', DuyetController.approveRequest);
router.post('/reject', DuyetController.rejectRequest);

module.exports = router;
