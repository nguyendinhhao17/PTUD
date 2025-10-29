const express = require('express');
const router = express.Router();
const ThanhToanHocPhiController = require('../controllers/ThanhToanHocPhiController');

router.get('/', (req, res) => {
    res.render('pages/thanhtoan', {
        title: 'Thanh toán học phí'
    });
});

router.get('/api/danh-sach-hoc-phi', ThanhToanHocPhiController.layDanhSachHocPhi);

router.post('/api/tinh-tong-tien', ThanhToanHocPhiController.tinhTongTien);

router.post('/api/thanh-toan', ThanhToanHocPhiController.thanhToan);

module.exports = router;
