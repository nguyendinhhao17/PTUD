const XinPhepNghiHocModel = require('../models/XinPhepNghiHocModel');

class XinPhepNghiHocController {
  static async renderPage(req, res) {
    try {
      res.render('pages/xinphepnghihoc', {
        title: 'Xin phép nghỉ học cho con'
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi server khi render trang');
    }
  }

  static async getDanhSachCon(req, res) {
    try {
      const maPhuHuynh = req.session.user?.username || 'PH001';
      const danhSachCon = await XinPhepNghiHocModel.getHocSinhByMaPhuHuynh(maPhuHuynh);
      res.json({ success: true, data: danhSachCon });
    } catch (error) {
      console.error('Lỗi lấy danh sách con:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }

  static async guiDon(req, res) {
    try {
      const { maHocSinh, tenHocSinh, lyDoNghi, ngay } = req.body;

      if (!tenHocSinh || tenHocSinh.trim() === '') {
        return res.json({ success: false, message: 'Vui lòng nhập đúng định dạng tên' });
      }

      if (!lyDoNghi || lyDoNghi.trim() === '') {
        return res.json({ success: false, message: 'Vui lòng điền lý do xin phép' });
      }

      if (!maHocSinh) {
        return res.json({ success: false, message: 'Không tìm thấy thông tin học sinh' });
      }

      const maPhieu = await XinPhepNghiHocModel.generateMaPhieu();

      await XinPhepNghiHocModel.createPhieuXinPhep({
        maPhieu,
        lyDoNghi,
        ngay: ngay || new Date().toISOString().split('T')[0],
        maHocSinh
      });

      res.json({
        success: true,
        message: 'Gửi đơn xin nghỉ thành công',
        maPhieu
      });
    } catch (error) {
      console.error('Lỗi gửi đơn:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi hệ thống, đã tự động lưu nháp'
      });
    }
  }

  static async getLichSuXinPhep(req, res) {
    try {
      const { maHocSinh } = req.query;
      if (!maHocSinh) {
        return res.json({ success: false, message: 'Thiếu mã học sinh' });
      }
      const lichSu = await XinPhepNghiHocModel.getPhieuXinPhepByHocSinh(maHocSinh);
      res.json({ success: true, data: lichSu });
    } catch (error) {
      console.error('Lỗi lấy lịch sử:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
}

module.exports = XinPhepNghiHocController;
