const db = require('../config/database');

class DuyetYeuCauSuaDiemModel {
  static async getPendingRequests() {
    const [rows] = await db.execute(
      `SELECT 
         yc.MaYeuCau,
         hs.MaHocSinh,
         hs.TenHocSinh,
         mh.TenMonHoc,
         yc.DiemCu,
         yc.DiemMoi,
         yc.LoaiDiem,
         yc.LyDo,
         yc.TrangThai,
         gv.TenGiaoVien
       FROM YeuCauSuaDiem yc
       JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
       JOIN MonHoc mh ON TRIM(yc.Mon) = TRIM(mh.TenMonHoc)
       JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
       WHERE yc.TrangThai = 'Đang xử lý'`
    );
    return rows;
  }

  static async getRequestDetails(maYeuCau) {
    const [rows] = await db.execute(
      `SELECT 
         yc.*,
         hs.TenHocSinh,
         hs.GioiTinh AS GioiTinhHS,
         hs.KhoaHoc,
         mh.TenMonHoc,
         gv.TenGiaoVien,
         gv.Email AS EmailGV,
         gv.SDT AS SDTGV
       FROM YeuCauSuaDiem yc
       JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
       JOIN MonHoc mh ON TRIM(yc.Mon) = TRIM(mh.TenMonHoc)
       JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
       WHERE yc.MaYeuCau = ?`,
      [maYeuCau]
    );

    if (!rows.length) return null;

    const yc = rows[0];
    yc.MinhChung = yc.MinhChung ? yc.MinhChung.split(',') : [];
    return yc;
  }

  static async approveRequest(maYeuCau, maHieuTruong) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.execute(
        'SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ?',
        [maYeuCau]
      );
      if (!rows.length) throw new Error('Yêu cầu không tồn tại');

      const yc = rows[0];
      const columnMap = { 'ThuongXuyen1':'ThuongXuyen1','ThuongXuyen2':'ThuongXuyen2','ThuongXuyen3':'ThuongXuyen3','Diem15_1':'Diem15_1','Diem15_2':'Diem15_2','GK':'GK','CK':'CK' };
      const col = columnMap[yc.LoaiDiem];
      if(!col) throw new Error('Loại điểm không hợp lệ');

      await conn.execute(
        `UPDATE Diem SET ${col} = ? WHERE MaHocSinh = ? AND TenMonHoc = ? AND NamHoc = ? AND HocKi = ?`,
        [yc.DiemMoi, yc.MaHocSinh, yc.Mon, yc.NamHoc, yc.HocKi]
      );

      await conn.execute(
        'UPDATE YeuCauSuaDiem SET TrangThai = ?, MaHieuTruong = ? WHERE MaYeuCau = ?',
        ['DaDuyet', maHieuTruong, maYeuCau]
      );

      await conn.commit();
      return true;
    } catch(err) {
      await conn.rollback();
      console.error(err);
      return false;
    } finally {
      conn.release();
    }
  }

  static async rejectRequest(maYeuCau, maHieuTruong) {
    const [result] = await db.execute(
      'UPDATE YeuCauSuaDiem SET TrangThai = ?, MaHieuTruong = ? WHERE MaYeuCau = ?',
      ['BiTuChoi', maHieuTruong, maYeuCau]
    );
    return result.affectedRows > 0;
  }
}

module.exports = DuyetYeuCauSuaDiemModel;
