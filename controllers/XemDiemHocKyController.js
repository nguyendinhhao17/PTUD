const XemDiemHocKyModel = require('../models/XemDiemHocKyModel');

class XemDiemHocKyController {
  static async renderPage(req, res) {
    try {
      const danhSachHocKy = await XemDiemHocKyModel.getDanhSachHocKy();
      res.render('pages/xemdiem', {
        title: 'Xem điểm học kỳ, hạnh kiểm, học lực',
        danhSachHocKy
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi server khi render trang');
    }
  }

  static async xemDiem(req, res) {
    try {
      const { namHoc, hocKy } = req.body;
      const maHocSinh = req.session.user?.username || 'HS001';

      if (!namHoc || !hocKy) {
        return res.json({
          success: false,
          message: 'Vui lòng chọn học kỳ để xem điểm'
        });
      }

      const thongTinHocSinh = await XemDiemHocKyModel.getThongTinHocSinh(maHocSinh);
      const danhSachDiem = await XemDiemHocKyModel.getDiemHocKy(maHocSinh, namHoc, hocKy);
      const hanhKiemHocLuc = await XemDiemHocKyModel.getHanhKiemHocLuc(maHocSinh, namHoc, hocKy);

      if (!danhSachDiem || danhSachDiem.length === 0) {
        return res.json({
          success: false,
          message: 'Không có dữ liệu điểm cho kỳ này'
        });
      }

      res.json({
        success: true,
        data: {
          thongTinHocSinh,
          danhSachDiem,
          hanhKiemHocLuc
        }
      });
    } catch (error) {
      console.error('Lỗi xem điểm:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
}

module.exports = XemDiemHocKyController;
