const DuyetModel = require('../models/DuyetYeuCauSuaDiemModel');

class DuyetController {
  // MẶC ĐỊNH: hiển thị danh sách Đang xử lý
  static async renderPage(req, res) {
    try {
      const requests = await DuyetModel.getRequestsByStatus('DangXuLy');
      res.render('pages/duyetyeucausuadiem', {
        title: 'Duyệt yêu cầu sửa điểm',
        requests
      });
    } catch (err) {
      console.error('Lỗi khi tải trang:', err);
      res.status(500).send('Lỗi server: ' + err.message);
    }
  }

  // API lấy danh sách theo trạng thái (lọc động)
  static async filterByStatus(req, res) {
    try {
      const { status } = req.params;
      const requests = status === 'All'
        ? await DuyetModel.getAllRequests()
        : await DuyetModel.getRequestsByStatus(status);
      res.json({ success: true, requests });
    } catch (err) {
      console.error('Lỗi khi lọc:', err);
      res.status(500).json({ success: false, message: 'Không thể lọc dữ liệu' });
    }
  }

  // Chi tiết
  static async getRequestDetails(req, res) {
    try {
      const { id } = req.params;
      const request = await DuyetModel.getRequestDetails(id);
      if (!request) return res.status(404).json({ success: false, message: 'Không tìm thấy yêu cầu' });
      res.json({ success: true, request });
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết:', err);
      res.status(500).json({ success: false, message: 'Lỗi server' });
    }
  }

  // Duyệt
  static async approveRequest(req, res) {
    try {
      const { id } = req.body;
      const maHieuTruong = req.session.user?.username;
      if (!maHieuTruong || req.session.user?.role !== 'Hiệu trưởng') {
        return res.status(401).json({ success: false, message: 'Không có quyền' });
      }
      const result = await DuyetModel.approveRequest(id, maHieuTruong);
      res.json(result);
    } catch (err) {
      console.error('Lỗi khi duyệt:', err);
      res.status(500).json({ success: false, message: 'Lỗi khi duyệt yêu cầu' });
    }
  }

  // Từ chối
  static async rejectRequest(req, res) {
    try {
      const { id, ghiChu } = req.body;
      const maHieuTruong = req.session.user?.username;
      if (!ghiChu) return res.status(400).json({ success: false, message: 'Vui lòng nhập lý do' });
      if (!maHieuTruong || req.session.user?.role !== 'Hiệu trưởng') {
        return res.status(401).json({ success: false, message: 'Không có quyền' });
      }
      const result = await DuyetModel.rejectRequest(id, ghiChu, maHieuTruong);
      res.json(result);
    } catch (err) {
      console.error('Lỗi khi từ chối:', err);
      res.status(500).json({ success: false, message: 'Lỗi khi từ chối yêu cầu' });
    }
  }
}

module.exports = DuyetController;
