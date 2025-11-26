const XacNhanNhapHocModel = require('../models/XacNhanNhapHocModel');

class XacNhanNhapHocController {
  static async renderPage(req, res) {
    try {
      const maThiSinh = req.session.user?.username || 'TS001';
      const thongTinTrungTuyen = await XacNhanNhapHocModel.getThongTinTrungTuyen(maThiSinh);
      const danhSachKhoi = await XacNhanNhapHocModel.getDanhSachKhoi();

      const trongThoiHan = await XacNhanNhapHocModel.kiemTraThoiHan(maThiSinh);

      res.render('pages/xacnhannhaphoc', {
        title: 'Xác nhận thông tin nhập học',
        thongTinTrungTuyen,
        danhSachKhoi,
        trongThoiHan
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi server khi render trang');
    }
  }

  static async xacNhan(req, res) {
    try {
      const { maKhoi } = req.body;
      const maThiSinh = req.session.user?.username || 'TS001';

      if (!maKhoi) {
        return res.json({ success: false, message: 'Vui lòng chọn khối học' });
      }

      const trongThoiHan = await XacNhanNhapHocModel.kiemTraThoiHan(maThiSinh);
      if (!trongThoiHan) {
        return res.json({ success: false, message: 'Đã quá thời hạn xác nhận nhập học' });
      }

      const result = await XacNhanNhapHocModel.xacNhanNhapHoc(maThiSinh, maKhoi);
      res.json(result);
    } catch (error) {
      console.error('Lỗi xác nhận nhập học:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
}

module.exports = XacNhanNhapHocController;
