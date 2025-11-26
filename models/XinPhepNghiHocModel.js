const db = require('../config/database');

class XinPhepNghiHocModel {
  static async createPhieuXinPhep(data) {
    const { maPhieu, lyDoNghi, ngay, maHocSinh } = data;
    const query = `
      INSERT INTO PhieuXinPhep (MaPhieu, LyDoNghi, Ngay, MaHocSinh)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [maPhieu, lyDoNghi, ngay, maHocSinh]);
    return result;
  }

  static async getHocSinhByMaPhuHuynh(maPhuHuynh) {
    const query = `
      SELECT hs.MaHocSinh, hs.TenHocSinh, l.TenLop
      FROM PhuHuynh ph
      JOIN HocSinh hs ON ph.MaHocSinh = hs.MaHocSinh
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      WHERE ph.SDT = ? OR ph.Email = ?
    `;
    const [rows] = await db.execute(query, [maPhuHuynh, maPhuHuynh]);
    return rows;
  }

  static async getPhieuXinPhepByHocSinh(maHocSinh) {
    const query = `
      SELECT p.MaPhieu, p.LyDoNghi, p.Ngay, hs.TenHocSinh, l.TenLop
      FROM PhieuXinPhep p
      JOIN HocSinh hs ON p.MaHocSinh = hs.MaHocSinh
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      WHERE p.MaHocSinh = ?
      ORDER BY p.Ngay DESC
    `;
    const [rows] = await db.execute(query, [maHocSinh]);
    return rows;
  }

  static async generateMaPhieu() {
    const [rows] = await db.execute('SELECT MaPhieu FROM PhieuXinPhep ORDER BY MaPhieu DESC LIMIT 1');
    if (rows.length === 0) return 'PX001';
    const lastMa = rows[0].MaPhieu;
    const num = parseInt(lastMa.substring(2)) + 1;
    return 'PX' + num.toString().padStart(3, '0');
  }
}

module.exports = XinPhepNghiHocModel;
