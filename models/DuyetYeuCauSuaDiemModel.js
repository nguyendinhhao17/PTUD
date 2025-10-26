// models/DuyetYeuCauSuaDiemModel.js
const db = require('../config/database');

class DuyetYeuCauSuaDiemModel {
  static async getLopTheoKhoi(khoi) {
    const [rows] = await db.execute(
      'SELECT MaLop, TenLop FROM Lop WHERE MaKhoi = ?',
      [khoi]
    );
    return rows;
  }

  static async getRequests(khoi, lop, mon) {
    const [rows] = await db.execute(
      `SELECT yc.ID, hs.TenHocSinh, mh.TenMon, yc.DiemCu, yc.DiemMoi, yc.LyDo, yc.TrangThai
       FROM YeuCauSuaDiem yc
       JOIN HocSinh hs ON yc.MaHS = hs.MaHS
       JOIN MonHoc mh ON yc.MaMon = mh.MaMon
       JOIN Lop l ON hs.MaLop = l.MaLop
       WHERE l.MaKhoi = ? AND hs.MaLop = ? AND yc.MaMon = ?`,
      [khoi, lop, mon]
    );
    return rows;
  }

  static async updateStatus(id, status) {
    const [result] = await db.execute(
      'UPDATE YeuCauSuaDiem SET TrangThai = ? WHERE ID = ?',
      [status, id]
    );
    
    return result.affectedRows > 0;
  }
}

module.exports = DuyetYeuCauSuaDiemModel;
