// controllers/DuyetYeuCauSuaDiemController.js
const DuyetYeuCauSuaDiemModel = require('../models/DuyetYeuCauSuaDiemModel');

class DuyetYeuCauSuaDiemController {
  // Render giao diện
  static renderPage(req, res) {
  res.render('pages/duyetyeucausuadiem', {
    title: 'Duyệt yêu cầu sửa điểm',
    requests: [] // ✅ thêm dòng này để tránh lỗi undefined
  });
}

  // Lấy danh sách lớp theo khối
  static async getLopTheoKhoi(req, res) {
    try {
      const { khoi } = req.body;
      const data = await DuyetYeuCauSuaDiemModel.getLopTheoKhoi(khoi);
      res.json({ success: true, data });
    } catch (error) {
      console.error('Lỗi getLopTheoKhoi:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }

  // Lấy danh sách yêu cầu
  static async getRequests(req, res) {
    try {
      const { khoi, lop, mon } = req.body;
      const data = await DuyetYeuCauSuaDiemModel.getRequests(khoi, lop, mon);
      res.json({ success: true, data });
    } catch (error) {
      console.error('Lỗi getRequests:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }

  // Cập nhật trạng thái duyệt
  static async updateStatus(req, res) {
    try {
      const { id, status } = req.body;
      const result = await DuyetYeuCauSuaDiemModel.updateStatus(id, status);
      res.json({ success: result });
    } catch (error) {
      console.error('Lỗi updateStatus:', error);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }
}

module.exports = DuyetYeuCauSuaDiemController;
