const db = require('../config/database');

class XemDiemHocKyModel {
  static async getDanhSachHocKy() {
    const query = `
      SELECT DISTINCT NamHoc, KyHoc
      FROM HocKy
      ORDER BY NamHoc DESC, KyHoc DESC
    `;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async getDiemHocKy(maHocSinh, namHoc, hocKy) {
    const query = `
      SELECT
        d.TenMonHoc,
        d.ThuongXuyen1, d.ThuongXuyen2, d.ThuongXuyen3,
        d.Diem15_1, d.Diem15_2,
        d.GK, d.CK, d.TrungBinhMon
      FROM Diem d
      WHERE d.MaHocSinh = ? AND d.NamHoc = ? AND d.HocKi = ?
      ORDER BY d.TenMonHoc
    `;
    const [rows] = await db.execute(query, [maHocSinh, namHoc, hocKy]);
    return rows;
  }

  static async getHanhKiemHocLuc(maHocSinh, namHoc, hocKy) {
    const query = `
      SELECT
        HanhKiem, HocLuc, DiemTongKet, RenLuyen, NhanXet
      FROM HocBa
      WHERE MaHocSinh = ? AND NamHoc = ? AND HocKy = ?
    `;
    const [rows] = await db.execute(query, [maHocSinh, namHoc, hocKy]);
    return rows[0] || null;
  }

  static async getThongTinHocSinh(maHocSinh) {
    const query = `
      SELECT
        hs.MaHocSinh, hs.TenHocSinh, hs.GioiTinh,
        hs.Birthday, l.TenLop, l.Khoi
      FROM HocSinh hs
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      WHERE hs.MaHocSinh = ?
    `;
    const [rows] = await db.execute(query, [maHocSinh]);
    return rows[0] || null;
  }
}

module.exports = XemDiemHocKyModel;
