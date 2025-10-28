const xetdiemrenluyenModel = require('../models/XetDiemRenLuyenModel');

class XetDiemRenLuyenController {
  async renderPage(req, res) {
    try {
      res.render('pages/xetdiemrenluyen', {
        statusMessage: ''
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Lỗi server khi render trang');
    }
  }

  async getHocSinhCN(req, res) {
    try {
      const { MaGVCN, NamHoc } = req.body;
      const MaLop = await xetdiemrenluyenModel.getMaLop(MaGVCN, NamHoc);
      if (!MaLop) {
        return res.status(404).json({ message: 'Không tìm thấy lớp cho giáo viên chủ nhiệm này trong năm học đã cho.' });
      } 
      const hocSinhList = await xetdiemrenluyenModel.getDSHocSinhCN(MaLop);
      res.json({ hocSinhList });
    } catch (error) {
      console.error('❌ Lỗi getHocSinhCN:', error);
      res.status(500).json({ message: 'Lỗi server khi lấy danh sách học sinh.' });
    }
  }
}

module.exports = XetDiemRenLuyenController;