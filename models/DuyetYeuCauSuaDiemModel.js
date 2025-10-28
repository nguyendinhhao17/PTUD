const db = require('../config/database');

class DuyetYeuCauSuaDiemModel {
  // Cập nhật điểm và trạng thái yêu cầu
  static async approveRequest(maYeuCau, maHieuTruong) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Lấy thông tin yêu cầu
      const [requests] = await connection.execute(
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ?`,
        [maYeuCau]
      );
      
      if (requests.length === 0) {
        throw new Error('Không tìm thấy yêu cầu');
      }

      const request = requests[0];

      // 2. Cập nhật điểm mới trong bảng Diem
      await connection.execute(
        `UPDATE Diem 
         SET Diem = ?, 
             NgayCapNhat = NOW()
         WHERE MaHocSinh = ? 
         AND TenMonHoc = ?
         AND NamHoc = ?
         AND HocKi = ?
         AND LoaiDiem = ?`,
        [
          request.DiemMoi,
          request.MaHocSinh,
          request.Mon,
          request.NamHoc,
          request.HocKi,
          request.LoaiDiem
        ]
      );

      // 3. Cập nhật trạng thái yêu cầu
      await connection.execute(
        `UPDATE YeuCauSuaDiem 
         SET TrangThai = 'Đã duyệt',
             MaHieuTruong = ?,
             NgayDuyet = NOW()
         WHERE MaYeuCau = ?`,
        [maHieuTruong, maYeuCau]
      );

      await connection.commit();
      return {
        success: true,
        message: 'Đã duyệt yêu cầu thành công',
        data: { newStatus: 'Đã duyệt' }
      };

    } catch (error) {
      await connection.rollback();
      console.error('Lỗi khi duyệt yêu cầu:', error);
      return {
        success: false,
        message: error.message || 'Lỗi khi duyệt yêu cầu'
      };
    } finally {
      connection.release();
    }
  }

  // Từ chối yêu cầu
  static async rejectRequest(maYeuCau, maHieuTruong) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Cập nhật trạng thái yêu cầu thành "Đã từ chối"
      await connection.execute(
        `UPDATE YeuCauSuaDiem 
         SET TrangThai = 'Đã từ chối',
             MaHieuTruong = ?,
             NgayDuyet = NOW()
         WHERE MaYeuCau = ?`,
        [maHieuTruong, maYeuCau]
      );

      await connection.commit();
      return {
        success: true,
        message: 'Đã từ chối yêu cầu',
        data: { newStatus: 'Đã từ chối' }
      };

    } catch (error) {
      await connection.rollback();
      console.error('Lỗi khi từ chối yêu cầu:', error);
      return {
        success: false,
        message: error.message || 'Lỗi khi từ chối yêu cầu'
      };
    } finally {
      connection.release();
    }
  }

  // Lấy danh sách yêu cầu đang xử lý, hiển thị năm học, học kỳ từ bảng YC
  static async getPendingRequests() {
    const [rows] = await db.execute(
      `SELECT 
         yc.MaYeuCau,
         hs.MaHocSinh,
         hs.TenHocSinh,
         l.TenLop AS TenLop,
         yc.NamHoc,
         yc.HocKi,
         mh.TenMonHoc,
         yc.DiemCu,
         yc.DiemMoi,
         yc.LoaiDiem,
         yc.LyDo,
         yc.TrangThai,
         gv.TenGiaoVien
       FROM YeuCauSuaDiem yc
       JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
       LEFT JOIN Lop l ON l.MaLop = hs.MaLop
       JOIN MonHoc mh ON TRIM(yc.Mon) = TRIM(mh.TenMonHoc)
       JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
       JOIN Diem d
         ON d.MaHocSinh = yc.MaHocSinh
         AND d.TenMonHoc = yc.Mon
         AND d.NamHoc = yc.NamHoc
         AND d.HocKi = yc.HocKi
       WHERE yc.TrangThai = 'DangXuLy'`
    );
    return rows;
  }

 static async getRequestDetails(maYeuCau) {
  const [rows] = await db.execute(
    `SELECT 
    yc.MaYeuCau,
    yc.TrangThai,
    yc.DiemCu,
    yc.DiemMoi,
    yc.LyDo,
    yc.MinhChung,
    yc.LoaiDiem,
    yc.Mon,
    yc.NamHoc,
    yc.HocKi,
    hs.MaHocSinh,
    hs.TenHocSinh,
    hs.GioiTinh AS GioiTinhHS,
    l.TenLop AS TenLop,   -- lấy tên lớp chính xác từ bảng Lop
    mh.TenMonHoc,
    gv.TenGiaoVien,
    gv.Email AS EmailGV,
    gv.SDT AS SDTGV
FROM YeuCauSuaDiem yc
JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
LEFT JOIN Lop l ON l.MaLop = hs.MaLop   -- join đúng qua MaLop
JOIN MonHoc mh ON TRIM(yc.Mon) = TRIM(mh.TenMonHoc)
JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
WHERE yc.MaYeuCau = ?
`,
    [maYeuCau]
  );

  if (!rows.length) return null;

  const yc = rows[0];
  yc.MinhChung = yc.MinhChung ? yc.MinhChung.split(',') : [];
  return yc;
}


  // Duyệt yêu cầu
  static async approveRequest(maYeuCau, maHieuTruong) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      
      const [rows] = await conn.execute(
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ? AND TrangThai = 'Đang xử lý'`,
        [maYeuCau]
      );
      if (!rows.length) throw new Error('Yêu cầu không tồn tại hoặc đã được xử lý');

      const yc = rows[0];

      const columnMap = {
        'ThuongXuyen1': 'ThuongXuyen1',
        'ThuongXuyen2': 'ThuongXuyen2',
        'ThuongXuyen3': 'ThuongXuyen3',
        'Diem15_1': 'Diem15_1',
        'Diem15_2': 'Diem15_2',
        'GK': 'GK',
        'CK': 'CK'
      };
      const col = columnMap[yc.LoaiDiem];
      if(!col) throw new Error('Loại điểm không hợp lệ');

      const [updateResult] = await conn.execute(
        `UPDATE Diem 
         SET ${col} = ?,
             TrungBinhMon = (ThuongXuyen1 + ThuongXuyen2 + ThuongXuyen3 + Diem15_1 + Diem15_2 + GK + CK) / 7
         WHERE MaHocSinh = ? AND TenMonHoc = ? AND NamHoc = ? AND HocKi = ?`,
        [yc.DiemMoi, yc.MaHocSinh, yc.Mon, yc.NamHoc, yc.HocKi]
      );
      if (updateResult.affectedRows === 0) throw new Error('Không tìm thấy bản ghi điểm cần cập nhật');

      await conn.execute(
        'UPDATE YeuCauSuaDiem SET TrangThai = ?, MaHieuTruong = ? WHERE MaYeuCau = ?',
        ['DaDuyet', maHieuTruong, maYeuCau]
      );

      await conn.commit();
      return {
        success: true,
        message: 'Duyệt yêu cầu và cập nhật điểm thành công',
        data: { newStatus: 'DaDuyet', maYeuCau }
      };
    } catch(err) {
      await conn.rollback();
      console.error('Lỗi khi duyệt yêu cầu:', err);
      return { success: false, message: err.message || 'Lỗi khi duyệt yêu cầu', error: err };
    } finally {
      conn.release();
    }
  }

  // Từ chối yêu cầu
  static async rejectRequest(maYeuCau, maHieuTruong) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [rows] = await conn.execute(
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ? AND TrangThai = 'Đang xử lý'`,
        [maYeuCau]
      );
      if (!rows.length) throw new Error('Yêu cầu không tồn tại hoặc đã được xử lý');

      const [result] = await conn.execute(
        'UPDATE YeuCauSuaDiem SET TrangThai = ?, MaHieuTruong = ? WHERE MaYeuCau = ?',
        ['BiTuChoi', maHieuTruong, maYeuCau]
      );

      if (result.affectedRows === 0) throw new Error('Không thể cập nhật trạng thái yêu cầu');

      await conn.commit();
      return { success: true, message: 'Từ chối yêu cầu thành công', data: { newStatus: 'BiTuChoi', maYeuCau } };
    } catch(err) {
      await conn.rollback();
      console.error('Lỗi khi từ chối yêu cầu:', err);
      return { success: false, message: err.message || 'Lỗi khi từ chối yêu cầu', error: err };
    } finally {
      if (conn) conn.release();
    }
  }
}

module.exports = DuyetYeuCauSuaDiemModel;
