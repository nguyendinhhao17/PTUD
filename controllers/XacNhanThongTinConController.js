const XacNhanThongTinConModel = require('../models/XacNhanThongTinConModel');

class XacNhanThongTinConController {
  static async renderPage(req, res) {
    try {
      const maPhuHuynh = req.session.user?.username || 'PH001';
      const danhSachCon = await XacNhanThongTinConModel.getDanhSachConCuaPhuHuynh(maPhuHuynh);

      res.render('pages/xacnhanthongtincon', {
        title: 'Xác nhận, chỉnh sửa thông tin con',
        danhSachCon
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi server khi render trang');
    }
  }

  static async getThongTinCon(req, res) {
    try {
      const { maHocSinh } = req.query;

      if (!maHocSinh) {
        return res.json({ success: false, message: 'Thiếu mã học sinh' });
      }

      const thongTin = await XacNhanThongTinConModel.getThongTinHocSinh(maHocSinh);

      if (!thongTin) {
        return res.status(404).json({
          success: false,
          message: 'Lỗi hệ thống, vui lòng thử lại sau'
        });
      }

      res.json({ success: true, data: thongTin });
    } catch (error) {
      console.error('Lỗi lấy thông tin:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi hệ thống, vui lòng thử lại sau'
      });
    }
  }

  static async xacNhanThongTin(req, res) {
    try {
      const { maHocSinh } = req.body;

      if (!maHocSinh) {
        return res.json({ success: false, message: 'Thiếu mã học sinh' });
      }

      await XacNhanThongTinConModel.xacNhanThongTin(maHocSinh);

      res.json({ success: true, message: 'Xác nhận thông tin thành công' });
    } catch (error) {
      console.error('Lỗi xác nhận:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }

  static async chinhSuaThongTin(req, res) {
    try {
      const { maHocSinh, tenHocSinh, birthday, gioiTinh } = req.body;

      if (!maHocSinh) {
        return res.json({ success: false, message: 'Thiếu mã học sinh' });
      }

      const validation = XacNhanThongTinConModel.validateThongTin({
        tenHocSinh,
        birthday,
        gioiTinh
      });

      if (!validation.valid) {
        return res.json({ success: false, message: validation.message });
      }

      await XacNhanThongTinConModel.capNhatThongTin(maHocSinh, {
        tenHocSinh,
        birthday,
        gioiTinh
      });

      res.json({ success: true, message: 'Xác nhận thông tin thành công' });
    } catch (error) {
      console.error('Lỗi chỉnh sửa:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
}

module.exports = XacNhanThongTinConController;
