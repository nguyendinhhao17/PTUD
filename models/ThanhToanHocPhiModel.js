const db = require('../config/database');

const ThanhToanHocPhiModel = {
    getHocPhiByHocSinh: async (maHocSinh) => {
        const query = `
            SELECT
                hp.MaHocSinh,
                hp.NamHoc,
                hp.HocKi,
                hp.HocPhi,
                hp.TrangThai,
                hs.TenHocSinh,
                l.TenLop
            FROM HocPhi hp
            JOIN HocSinh hs ON hp.MaHocSinh = hs.MaHocSinh
            JOIN Lop l ON hs.MaLop = l.MaLop
            WHERE hp.MaHocSinh = ? AND hp.TrangThai = 'Chưa nộp'
            ORDER BY hp.NamHoc, hp.HocKi
        `;
        const [rows] = await db.query(query, [maHocSinh]);
        return rows;
    },

    getChiTietHocPhi: async (maHocSinh, namHoc, hocKi) => {
        const query = `
            SELECT
                hp.MaHocSinh,
                hp.NamHoc,
                hp.HocKi,
                hp.HocPhi,
                hp.TrangThai,
                hs.TenHocSinh,
                l.TenLop
            FROM HocPhi hp
            JOIN HocSinh hs ON hp.MaHocSinh = hs.MaHocSinh
            JOIN Lop l ON hs.MaLop = l.MaLop
            WHERE hp.MaHocSinh = ? AND hp.NamHoc = ? AND hp.HocKi = ?
        `;
        const [rows] = await db.query(query, [maHocSinh, namHoc, hocKi]);
        return rows[0];
    },

    capNhatTrangThaiHocPhi: async (maHocSinh, namHoc, hocKi) => {
        const query = `
            UPDATE HocPhi
            SET TrangThai = 'Đã nộp'
            WHERE MaHocSinh = ? AND NamHoc = ? AND HocKi = ?
        `;
        const [result] = await db.query(query, [maHocSinh, namHoc, hocKi]);
        return result;
    },

    themGiaoDich: async (giaoDichData) => {
        const query = `
            INSERT INTO GiaoDichHocPhi
            (MaGiaoDich, MaHocSinh, NamHoc, HocKi, SoTien, PhuongThucThanhToan, TrangThai, NgayThanhToan)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const [result] = await db.query(query, [
            giaoDichData.maGiaoDich,
            giaoDichData.maHocSinh,
            giaoDichData.namHoc,
            giaoDichData.hocKi,
            giaoDichData.soTien,
            giaoDichData.phuongThucThanhToan,
            giaoDichData.trangThai
        ]);
        return result;
    },

    tinhTongTien: (danhSachPhi) => {
        return danhSachPhi.reduce((tong, phi) => tong + parseFloat(phi.soTien), 0);
    }
};

module.exports = ThanhToanHocPhiModel;
