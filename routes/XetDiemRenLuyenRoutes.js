const express = require('express');
const XetDiemRenLuyenController = require('../controllers/XetDiemRenLuyenController');
const xetdiemrenluyenControllerInstance = new XetDiemRenLuyenController();
const router = express.Router();

router.get('/render', xetdiemrenluyenControllerInstance.renderPage)
router.get('/getdanhsachhocsinh', xetdiemrenluyenControllerInstance.getHocSinhCN);
module.exports = router;