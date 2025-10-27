const DuyetModel = require('../models/DuyetYeuCauSuaDiemModel');

class DuyetController {
  static async renderPage(req, res) {
    try {
      const requests = await DuyetModel.getPendingRequests();
      res.render('pages/duyetyeucausuadiem', { title: 'Duyệt yêu cầu sửa điểm', requests });
    } catch(err) {
      console.error(err);
      res.status(500).send('Lỗi server');
    }
  }

  static async getRequestDetails(req, res) {
    try {
      const { id } = req.params;
      const request = await DuyetModel.getRequestDetails(id);
      if(!request) return res.json({ success:false, message:'Không tìm thấy yêu cầu' });
      res.json({ success:true, request });
    } catch(err) {
      console.error(err);
      res.status(500).json({ success:false, message:'Lỗi server' });
    }
  }

  static async approveRequest(req, res) {
    try {
      const { id } = req.body;
      const maHieuTruong = req.session.maHieuTruong;
      if(!maHieuTruong) return res.status(401).json({ success:false, message:'Chưa đăng nhập' });
      const success = await DuyetModel.approveRequest(id, maHieuTruong);
      res.json({ success, message: success ? 'Duyệt thành công' : 'Duyệt thất bại' });
    } catch(err) {
      console.error(err);
      res.status(500).json({ success:false, message:'Lỗi server' });
    }
  }

  static async rejectRequest(req, res) {
    try {
      const { id } = req.body;
      const maHieuTruong = req.session.maHieuTruong;
      if(!maHieuTruong) return res.status(401).json({ success:false, message:'Chưa đăng nhập' });
      const success = await DuyetModel.rejectRequest(id, maHieuTruong);
      res.json({ success, message: success ? 'Từ chối thành công' : 'Thao tác thất bại' });
    } catch(err) {
      console.error(err);
      res.status(500).json({ success:false, message:'Lỗi server' });
    }
  }
}

module.exports = DuyetController;
