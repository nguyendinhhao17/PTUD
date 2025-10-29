const ThanhToanHocPhiModel = require('../models/ThanhToanHocPhiModel');

const ThanhToanHocPhiController = {
    layDanhSachHocPhi: async (req, res) => {
        try {
            const maHocSinh = req.session.userId || 'HS001';

            const danhSachHocPhi = await ThanhToanHocPhiModel.getHocPhiByHocSinh(maHocSinh);

            const ketQua = danhSachHocPhi.map(hp => ({
                maHocSinh: hp.MaHocSinh,
                tenHocSinh: hp.TenHocSinh,
                tenLop: hp.TenLop,
                namHoc: hp.NamHoc,
                hocKi: hp.HocKi,
                hocPhi: parseFloat(hp.HocPhi),
                trangThai: hp.TrangThai,
                hocPhiHocKy: parseFloat(hp.HocPhi),
                phiTaiLieu: 300000,
                phiBaoHiem: 250000,
                phiHoatDongNgoaiKhoa: 500000
            }));

            res.json({ success: true, data: ketQua });
        } catch (error) {
            console.error('Lỗi lấy danh sách học phí:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    tinhTongTien: async (req, res) => {
        try {
            const { danhSachPhi } = req.body;

            if (!danhSachPhi || danhSachPhi.length === 0) {
                return res.json({ success: true, tongTien: 0 });
            }

            const tongTien = danhSachPhi.reduce((tong, item) => {
                let phiItem = 0;
                if (item.hocPhiHocKy) phiItem += parseFloat(item.hocPhiHocKy);
                if (item.phiTaiLieu) phiItem += parseFloat(item.phiTaiLieu);
                if (item.phiBaoHiem) phiItem += parseFloat(item.phiBaoHiem);
                if (item.phiHoatDongNgoaiKhoa) phiItem += parseFloat(item.phiHoatDongNgoaiKhoa);
                return tong + phiItem;
            }, 0);

            res.json({ success: true, tongTien });
        } catch (error) {
            console.error('Lỗi tính tổng tiền:', error);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    },

    thanhToan: async (req, res) => {
        try {
            const { namHoc, hocKi, danhSachPhi, phuongThucThanhToan, tongTien } = req.body;
            const maHocSinh = req.session.userId || 'HS001';

            if (!danhSachPhi || danhSachPhi.length === 0) {
                return res.json({ success: false, message: 'Không có khoản phí nào được chọn' });
            }

            const chiTietHocPhi = await ThanhToanHocPhiModel.getChiTietHocPhi(maHocSinh, namHoc, hocKi);

            if (!chiTietHocPhi) {
                return res.json({ success: false, message: 'Không tìm thấy thông tin học phí' });
            }

            if (chiTietHocPhi.TrangThai === 'Đã nộp') {
                return res.json({ success: false, message: 'Học phí đã được thanh toán trước đó' });
            }

            const maGiaoDich = 'GD' + Date.now();

            const giaoDichData = {
                maGiaoDich,
                maHocSinh,
                namHoc,
                hocKi,
                soTien: tongTien,
                phuongThucThanhToan,
                trangThai: 'Thành công'
            };

            await ThanhToanHocPhiModel.capNhatTrangThaiHocPhi(maHocSinh, namHoc, hocKi);

            res.json({
                success: true,
                message: 'Thanh toán thành công',
                maGiaoDich,
                tongTien
            });
        } catch (error) {
            console.error('Lỗi thanh toán:', error);
            res.status(500).json({
                success: false,
                message: 'Thanh toán thất bại do lỗi hệ thống'
            });
        }
    }
};

module.exports = ThanhToanHocPhiController;
