const db = require('../config/database');

class XacNhanThongTinConModel {
  static async getThongTinHocSinh(maHocSinh) {
    const query = `
      SELECT
        hs.MaHocSinh, hs.TenHocSinh, hs.Birthday,
        hs.GioiTinh, hs.KhoaHoc, hs.TrangThai,
        l.TenLop, l.MaLop
      FROM HocSinh hs
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      WHERE hs.MaHocSinh = ?
    `;
    const [rows] = await db.execute(query, [maHocSinh]);
    return rows[0] || null;
  }

  static async getDanhSachConCuaPhuHuynh(maPhuHuynh) {
    const query = `
      SELECT
        hs.MaHocSinh, hs.TenHocSinh, hs.Birthday,
        hs.GioiTinh, l.TenLop
      FROM PhuHuynh ph
      JOIN HocSinh hs ON ph.MaHocSinh = hs.MaHocSinh
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      WHERE ph.SDT = ? OR ph.Email = ?
    `;
    const [rows] = await db.execute(query, [maPhuHuynh, maPhuHuynh]);
    return rows;
  }

  static async xacNhanThongTin(maHocSinh) {
    const query = `
      UPDATE HocSinh
      SET TrangThai = 'Đã xác nhận'
      WHERE MaHocSinh = ?
    `;
    const [result] = await db.execute(query, [maHocSinh]);
    return result;
  }

  static async capNhatThongTin(maHocSinh, data) {
    const { tenHocSinh, birthday, gioiTinh } = data;

    const updates = [];
    const values = [];

    if (tenHocSinh) {
      updates.push('TenHocSinh = ?');
      values.push(tenHocSinh);
    }
    if (birthday) {
      updates.push('Birthday = ?');
      values.push(birthday);
    }
    if (gioiTinh) {
      updates.push('GioiTinh = ?');
      values.push(gioiTinh);
    }

    if (updates.length === 0) {
      throw new Error('Không có thông tin cần cập nhật');
    }

    values.push(maHocSinh);
    const query = `UPDATE HocSinh SET ${updates.join(', ')}, TrangThai = 'Đã xác nhận' WHERE MaHocSinh = ?`;

    const [result] = await db.execute(query, values);
    return result;
  }

  static validateThongTin(data) {
    const { tenHocSinh, birthday, gioiTinh } = data;

    if (tenHocSinh && !/^[\p{L}\s]+$/u.test(tenHocSinh)) {
      return { valid: false, message: 'Tên không hợp lệ' };
    }

    if (birthday) {
      const ngay = new Date(birthday);
      if (isNaN(ngay.getTime())) {
        return { valid: false, message: 'Ngày sinh không hợp lệ' };
      }
    }

    if (gioiTinh && !['Nam', 'Nữ'].includes(gioiTinh)) {
      return { valid: false, message: 'Giới tính không hợp lệ' };
    }

    return { valid: true };
  }
}

module.exports = XacNhanThongTinConModel;
