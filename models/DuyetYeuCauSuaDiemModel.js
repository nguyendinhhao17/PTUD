const db = require('../config/database');

class DuyetYeuCauSuaDiemModel {
  // Cập nhật điểm và trạng thái yêu cầu
  static async approveRequest(maYeuCau, maHieuTruong) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Lấy thông tin yêu cầu và kiểm tra trạng thái
      const [requests] = await connection.execute(
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ? AND TrangThai = 'DangXuLy'`,
        [maYeuCau]
      );
      
      if (requests.length === 0) {
        throw new Error('Không tìm thấy yêu cầu hoặc yêu cầu không ở trạng thái đang xử lý');
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
         SET TrangThai = 'DaDuyet',
             MaHieuTruong = ?
         WHERE MaYeuCau = ?`,
        [maHieuTruong, maYeuCau]
      );

      await connection.commit();
      return {
        success: true,
        message: 'Đã duyệt yêu cầu thành công',
        data: { newStatus: 'DaDuyet' }
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
  static async rejectRequest(maYeuCau, ghiChu, maHieuTruong) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Kiểm tra yêu cầu có tồn tại và đang ở trạng thái chờ xử lý không
      const [requests] = await connection.execute(
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ? AND TrangThai = 'DangXuLy'`,
        [maYeuCau]
      );

      if (requests.length === 0) {
        throw new Error('Không tìm thấy yêu cầu hoặc yêu cầu đã được xử lý');
      }

      // Cập nhật trạng thái và ghi chú
      await connection.execute(
        `UPDATE YeuCauSuaDiem 
         SET TrangThai = 'BiTuChoi',
             GhiChu = ?,
             MaHieuTruong = ?
         WHERE MaYeuCau = ?`,
        [ghiChu, maHieuTruong, maYeuCau]
      );

      await connection.commit();
      return {
        success: true,
        message: 'Đã từ chối yêu cầu thành công',
        data: { newStatus: 'BiTuChoi' }
      };

    } catch (error) {
      await connection.rollback();
      console.error('Lỗi khi từ chối yêu cầu:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async getRequestsByStatus(status) {
  try {
    console.log('Model - Lọc theo trạng thái:', status);

    // Không cần chuyển đổi nữa vì frontend đã gửi đúng tên trong DB
    const dbStatus = status;

    let query = `
      SELECT 
        yc.MaYeuCau,
        hs.MaHocSinh,
        hs.TenHocSinh,
        l.TenLop,
        yc.Mon AS TenMonHoc,
        yc.LoaiDiem,
        yc.DiemCu,
        yc.DiemMoi,
        yc.LyDo,
        gv.TenGiaoVien,
        yc.TrangThai,
        yc.GhiChu
      FROM YeuCauSuaDiem yc
      JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      LEFT JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
    `;

    // Thêm điều kiện lọc theo trạng thái
    if (dbStatus) {
      query += ' WHERE yc.TrangThai = ?';
    }

    query += ' ORDER BY yc.MaYeuCau DESC';

    const [rows] = dbStatus ? 
      await db.execute(query, [dbStatus]) : 
      await db.execute(query);

    return rows;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu cầu:', error);
    throw new Error('Không thể lấy danh sách yêu cầu');
  }
}
// ==============================
// LẤY DANH SÁCH YÊU CẦU THEO TRẠNG THÁI
// ==============================
static async getRequestsByStatus(status) {
  try {
    console.log('Model - Lọc theo trạng thái:', status);

    // Chuyển giá trị từ frontend sang DB
    let dbStatus = null;
    switch (data-status) {
      case 'pending': dbStatus = 'DangXuLy'; break;
      case 'daduyet': dbStatus = 'DaDuyet'; break;
      case 'bituchoi': dbStatus = 'BiTuChoi'; break;
      default: dbStatus = null; // all hoặc không có => lấy tất cả
    }

    // Base query
    let query = `
      SELECT 
        yc.MaYeuCau,
        hs.MaHocSinh,
        hs.TenHocSinh,
        l.TenLop,
        yc.Mon AS TenMonHoc,
        yc.LoaiDiem,
        yc.DiemCu,
        yc.DiemMoi,
        yc.LyDo,
        gv.TenGiaoVien,
        yc.TrangThai,
        yc.GhiChu
      FROM YeuCauSuaDiem yc
      JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
      LEFT JOIN Lop l ON hs.MaLop = l.MaLop
      LEFT JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
    `;

    // Thêm điều kiện nếu có trạng thái cụ thể
    if (dbStatus) query += ` WHERE yc.TrangThai = ?`;

    query += ` ORDER BY yc.MaYeuCau DESC`;

    const [rows] = dbStatus
      ? await db.execute(query, [dbStatus])
      : await db.execute(query);

    console.log(`Số yêu cầu tìm được (${dbStatus || 'Tất cả'}):`, rows.length);
    return rows;
  } catch (error) {
    console.error('❌ Lỗi khi lấy danh sách yêu cầu:', error);
    throw new Error('Không thể lấy danh sách yêu cầu');
  }
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
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ? AND TrangThai = 'DangXuLy'`,
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
        `SELECT * FROM YeuCauSuaDiem WHERE MaYeuCau = ? AND TrangThai = 'DangXuLy'`,
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

  // Lấy thông tin ghi chú và lịch sử của yêu cầu
  static async getRequestNotes(maYeuCau) {
    try {
      const [rows] = await db.execute(
        `SELECT 
          yc.MaYeuCau,
          yc.TrangThai,
          yc.GhiChu,
          ht.TenHieuTruong
        FROM YeuCauSuaDiem yc
        LEFT JOIN HieuTruong ht ON yc.MaHieuTruong = ht.MaHieuTruong
        WHERE yc.MaYeuCau = ?`,
        [maYeuCau]
      );

      return {
        success: true,
        data: rows[0] || null
      };
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử ghi chú:', error);
      return {
        success: false,
        message: 'Không thể lấy thông tin ghi chú'
      };
    }
  }
  static async getAllRequests() {
  const [rows] = await db.execute(`
    SELECT yc.MaYeuCau, hs.MaHocSinh, hs.TenHocSinh, l.TenLop,
           yc.Mon AS TenMonHoc, yc.LoaiDiem, yc.DiemCu, yc.DiemMoi,
           yc.LyDo, yc.TrangThai, yc.NamHoc, yc.HocKy, gv.TenGiaoVien
    FROM YeuCauSuaDiem yc
    JOIN HocSinh hs ON yc.MaHocSinh = hs.MaHocSinh
    LEFT JOIN Lop l ON hs.MaLop = l.MaLop
    LEFT JOIN GiaoVien gv ON yc.MaGiaoVien = gv.MaGiaoVien
    ORDER BY yc.MaYeuCau DESC 
  `);
  return rows;
}
}

module.exports = DuyetYeuCauSuaDiemModel;
