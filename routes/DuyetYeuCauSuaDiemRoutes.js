const express = require('express');
const router = express.Router();
const DuyetController = require('../controllers/DuyetYeuCauSuaDiemController');

router.get('/render', DuyetController.renderPage);
router.get('/details/:id', DuyetController.getRequestDetails);
router.post('/approve', DuyetController.approveRequest);
router.post('/reject', DuyetController.rejectRequest);
router.get('/filter/:status', DuyetController.filterByStatus);

module.exports = router;
