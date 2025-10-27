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
      const maHieuTruong = req.session.user?.username; // Dùng username vì nó chính là mã hiệu trưởng
      
      if(!maHieuTruong || req.session.user?.role !== 'Hiệu trưởng') {
        console.log('Session user:', req.session.user); // Thêm log để debug
        return res.status(401).json({ 
          success: false, 
          message: 'Chưa đăng nhập hoặc không có quyền duyệt' 
        });
      }

      const result = await DuyetModel.approveRequest(id, maHieuTruong);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message || 'Lỗi khi duyệt yêu cầu'
        });
      }
    } catch(err) {
      console.error('Controller - Lỗi duyệt:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi xử lý duyệt yêu cầu' 
      });
    }
  }

  static async rejectRequest(req, res) {
    try {
      const { id } = req.body;
      const maHieuTruong = req.session.user?.username; // Dùng username vì nó chính là mã hiệu trưởng
      
      if(!maHieuTruong || req.session.user?.role !== 'Hiệu trưởng') {
        console.log('Session user:', req.session.user); // Thêm log để debug
        return res.status(401).json({ 
          success: false, 
          message: 'Chưa đăng nhập hoặc không có quyền từ chối' 
        });
      }

      const result = await DuyetModel.rejectRequest(id, maHieuTruong);
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          data: result.data
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch(err) {
      console.error('Controller - Lỗi từ chối:', err);
      res.status(500).json({ 
        success: false, 
        message: 'Lỗi server khi xử lý từ chối yêu cầu' 
      });
    }
  }
}

module.exports = DuyetController;
