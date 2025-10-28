const xemTK = require('../models/DuyetYeuCauSuaDiemModel');

class xemTK {
  static async renderPage(req, res) {
    try {

      res.render('pages/xemthongkeketqua', { title: 'Duyệt yêu cầu sửa điểm' });
    } catch(err) {
      console.error(err);
      res.status(500).send('Lỗi server');
    }
  }

}
module.exports = xemTK;