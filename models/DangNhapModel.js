const db = require('../config/database');

class TaiKhoan {
  // 🔹 Hàm đăng nhập
  static async login(username, password) {
    try {
      // Lấy thông tin tài khoản
      const [rows] = await db.execute(
        `SELECT 
          TenTaiKhoan,
          LoaiTaiKhoan,
          CASE 
            WHEN LoaiTaiKhoan = 'HieuTruong' THEN 
              (SELECT MaHieuTruong FROM HieuTruong WHERE TenTaiKhoan = ?)
            WHEN LoaiTaiKhoan = 'GiaoVien' THEN 
              (SELECT MaGiaoVien FROM GiaoVien WHERE TenTaiKhoan = ?)
            WHEN LoaiTaiKhoan = 'HocSinh' THEN 
              (SELECT MaHocSinh FROM HocSinh WHERE TenTaiKhoan = ?)
            ELSE NULL
          END as UserId
        FROM TaiKhoan 
        WHERE TenTaiKhoan = ? AND MatKhau = ?`,
        [username, username, username, username, password]
      );

      // Nếu không tìm thấy tài khoản
      if (rows.length === 0) return null;

      // Trả về thông tin người dùng đầu tiên
      return rows[0];
    } catch (error) {
      console.error('❌ Lỗi trong TaiKhoan.login:', error);
      throw error;
    }
  }

  // 🔹 (Tuỳ chọn) Kiểm tra tồn tại tài khoản
  static async exists(username) {
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS count FROM TaiKhoan WHERE TenTaiKhoan = ?',
      [username]
    );
    return rows[0].count > 0;
  }

  // 🔹 (Tuỳ chọn) Tạo tài khoản mới
  static async create(username, password, role = 'User') {
    await db.execute(
      'INSERT INTO TaiKhoan (TenTaiKhoan, MatKhau, VaiTro) VALUES (?, ?, ?)',
      [username, password, role]
    );
  }
}

module.exports = TaiKhoan;
