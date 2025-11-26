const db = require('../config/database');

class XacNhanNhapHocModel {
  static async getThongTinTrungTuyen(maThiSinh) {
    const query = `
      SELECT
        ts.MaThiSinh, ts.HoTen, ts.NgaySinh, ts.TongDiem,
        kq.NguyenVongTrungTuyen, kq.DiemTrungTuyen, kq.TinhTrang,
        nv.MaTruong, nv.ToHopMon,
        t.TenTruong, t.DiaChi,
        th.TenToHop
      FROM ThiSinhDuThi ts
      JOIN KetQuaTuyenSinh kq ON ts.MaThiSinh = kq.MaThiSinh
      JOIN NguyenVong nv ON kq.NguyenVongTrungTuyen = nv.MaNguyenVong
      JOIN Truong t ON nv.MaTruong = t.MaTruong
      JOIN ToHopMon th ON nv.ToHopMon = th.MaToHop
      WHERE ts.MaThiSinh = ? AND kq.TinhTrang = 'Đậu'
    `;
    const [rows] = await db.execute(query, [maThiSinh]);
    return rows[0] || null;
  }

  static async getDanhSachKhoi() {
    const query = `SELECT MaKhoi, TenKhoi FROM Khoi ORDER BY MaKhoi`;
    const [rows] = await db.execute(query);
    return rows;
  }

  static async xacNhanNhapHoc(maThiSinh, maKhoi) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      await conn.execute(
        `UPDATE KetQuaTuyenSinh SET TinhTrang = 'Đã nhập học' WHERE MaThiSinh = ?`,
        [maThiSinh]
      );

      const [thongTin] = await conn.execute(
        `SELECT ts.HoTen, nv.MaTruong, kq.KhoaHoc
         FROM ThiSinhDuThi ts
         JOIN KetQuaTuyenSinh kq ON ts.MaThiSinh = kq.MaThiSinh
         JOIN NguyenVong nv ON kq.NguyenVongTrungTuyen = nv.MaNguyenVong
         WHERE ts.MaThiSinh = ?`,
        [maThiSinh]
      );

      if (thongTin.length > 0) {
        const maHocSinh = 'HS' + maThiSinh.substring(2);
        await conn.execute(
          `INSERT INTO HocSinh (MaHocSinh, TenHocSinh, KhoaHoc, TrangThai, MaLop)
           VALUES (?, ?, ?, 'Chờ phân lớp', NULL)`,
          [maHocSinh, thongTin[0].HoTen, thongTin[0].KhoaHoc]
        );
      }

      await conn.commit();
      return { success: true, message: 'Xác nhận nhập học thành công' };
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  static async kiemTraThoiHan(maThiSinh) {
    const [rows] = await db.execute(
      `SELECT NgayThi FROM ThiSinhDuThi WHERE MaThiSinh = ?`,
      [maThiSinh]
    );
    if (rows.length === 0) return false;

    const ngayThi = new Date(rows[0].NgayThi);
    const hanXacNhan = new Date(ngayThi);
    hanXacNhan.setDate(hanXacNhan.getDate() + 30);

    return new Date() <= hanXacNhan;
  }
}

module.exports = XacNhanNhapHocModel;
