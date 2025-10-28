const db = require('../config/database');

class xetdiemrenluyenModel {
  // Lấy danh sách học sinh trong lớp
  // 🔹 2.1: Lấy mã lớp mà giáo viên chủ nhiệm phụ trách trong năm học
  async getMaLop(MaGVCN, NamHoc) {
    try {
      const [rows] = await db.execute(
        `SELECT MaLop FROM Lop WHERE MaGVCN = ? AND NamHoc = ? LIMIT 1`,
        [MaGVCN, NamHoc]
      );
      return rows.length ? rows[0].MaLop : null;
    } catch (error) {
      console.error('❌ Lỗi getMaLop:', error);
      throw error;
    }
  }

  async getDSHocSinhCN(MaLop) {
    try {
      const [rows] = await db.execute(
        `SELECT MaHocSinh, TenHocSinh FROM HocSinh WHERE MaLop = ?`,
        [MaLop]
      );
      return rows;
    } catch (error) {
      console.error('❌ Lỗi getDSHocSinhCN:', error);
      throw error;
    }
  }
  

}

module.exports = new xetdiemrenluyenModel();