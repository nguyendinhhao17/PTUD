-- ==========================
-- 3. THÊM DỮ LIỆU TEST CHO 27 BẢNG
-- ==========================

-- 1️⃣ Khoi, ToHopMon, HocKy, NamThi, Truong
INSERT INTO Khoi (MaKhoi, TenKhoi) VALUES
('K01','Khối 10'),
('K02','Khối 11'),
('K03','Khối 12');

INSERT INTO ToHopMon (MaToHop, TenToHop) VALUES
('TH01','Toán, Lý, Hóa'),
('TH02','Văn, Sử, Địa'),
('TH03','Anh, Tin, GDCD');

INSERT INTO HocKy (NamHoc, KyHoc, TrangThai, NgayBatDau, NgayKetThuc) VALUES
('2025-2026','1','Đang học','2025-09-01','2025-12-20'),
('2025-2026','2','Chưa bắt đầu','2026-01-05','2026-05-10'),
('2026-2027','1','Chưa bắt đầu','2026-09-01','2026-12-20');

INSERT INTO NamThi (TimeStart, TimeEnd) VALUES
('2025','2026'),
('2026','2027');

INSERT INTO Truong (MaTruong, TenTruong, DiaChi, Email, TrangThai, SDT) VALUES
('T01','THPT A','123 Đường A, HCM','thpta@gmail.com',1,'0909123456'),
('T02','THPT B','456 Đường B, HCM','thptb@gmail.com',1,'0909765432'),
('T03','THPT C','789 Đường C, HCM','thptc@gmail.com',1,'0909988776');

-- 2️⃣ MonHoc, Lop, GiaoVien
INSERT INTO MonHoc (TenMonHoc, SoTiet, MaToHop, TrangThai, Khoi) VALUES
('Toán', '2', 'TH01', 'Đang dạy', 'K01'),
('Lý', '3', 'TH01', 'Đang dạy', 'K01'),
('Văn', '4', 'TH02', 'Đang dạy', 'K01'),
('Anh', '2', 'TH03', 'Đang dạy', 'K01'),
('Tin', '2', 'TH03', 'Đang dạy', 'K01');


INSERT INTO Lop (MaLop, TenLop, MaToHop, TrangThai, Khoi, SiSo, MaTruong) VALUES
('L01','10A1','TH01','Đang học','K01',35,'T01'),
('L02','10A2','TH01','Đang học','K01',30,'T01'),
('L03','10B1','TH02','Đang học','K01',32,'T02');

INSERT INTO GiaoVien (MaGiaoVien, TenGiaoVien, GioiTinh, NgaySinh, Email, SDT, TrinhDoChuyenMon, DiaChi, NgayVaoTruong, TrangThai, TenMonHoc, TinhTrangHonNhan, ChucVu, ThamNien, MaTruong)
VALUES
('GV001','Nguyen Van D','Nam','1980-03-10','gv1@gmail.com','0912345678','Cử nhân Toán','HCM','2010-09-01','Đang công tác','Toán','Độc Thân','Giáo viên','15 năm','T01'),
('GV002','Tran Thi E','Nữ','1982-11-20','gv2@gmail.com','0987654321','Cử nhân Lý','HCM','2011-08-15','Đang công tác','Lý','Đã Kết Hôn','Giáo viên','14 năm','T01'),
('GV003','Le Van F','Nam','1978-02-05','gv3@gmail.com','0911223344','Cử nhân Văn','HCM','2012-07-01','Đang công tác','Văn','Độc Thân','Giáo viên','13 năm','T02');

-- 3️⃣ HocSinh, GVChuNhiem, GVBoMon, BaiTap, PhuHuynh
INSERT INTO HocSinh (MaHocSinh, TenHocSinh, Birthday, KhoaHoc, GioiTinh, TrangThai, MaLop) VALUES
('HS001','Nguyen Van A','2009-05-12','2025-2026','Nam','Đang học','L01'),
('HS002','Tran Thi B','2009-07-20','2025-2026','Nữ','Đang học','L01'),
('HS003','Le Van C','2009-06-15','2025-2026','Nam','Đang học','L02'),
('HS004','Pham Thi D','2009-08-10','2025-2026','Nữ','Đang học','L03');

INSERT INTO GVChuNhiem (MaGVCN, MaLop, NamHoc) VALUES
('GV001','L01','2025-2026'),
('GV003','L03','2025-2026');

INSERT INTO GVBoMon (MaGVBM, MaLop, NamHoc, HocKy, BoMon) VALUES
('GV001','L01','2025-2026','1', 'Toán 10'),
('GV002','L01','2025-2026','1', 'Lý 10'),
('GV003','L03','2025-2026','1', 'Văn 10');


INSERT INTO BaiTap (MaBaiTap, NoiDung, NgayGiao, NgayHetHan, MaLop, MaGiaoVien) VALUES
('BT001','Vẽ đồ thị hàm số y=2x+1','2025-09-02','2025-09-10','L01','GV001'),
('BT002','Vẽ biểu đồ cột số học sinh theo lớp','2025-09-03','2025-09-11','L01','GV002'),
('BT003','Tạo sơ đồ tổ chức lớp học','2025-09-04','2025-09-12','L02','GV003');

INSERT INTO PhuHuynh (HoTen, Email, SDT, MaHocSinh) VALUES
('Nguyen Van F','phuhuynh1@gmail.com','0911222333','HS001'),
('Tran Thi G','phuhuynh2@gmail.com','0911333444','HS002'),
('Le Thi H','phuhuynh3@gmail.com','0911444555','HS003');


INSERT INTO Diem (MaHocSinh, TenMonHoc, NamHoc, HocKi, ThuongXuyen1, ThuongXuyen2, ThuongXuyen3, Diem15_1, Diem15_2, GK, CK, TrungBinhMon) VALUES
('HS001','Toán','2025-2026','1',8,9,10,9,8,8.5,9,8.8),
('HS002','Toán','2025-2026','1',7,8,9,7,8,8,8,8.0),
('HS003','Văn','2025-2026','1',9,9,10,9,9,9,9,9.0);


INSERT INTO HocPhi (MaHocSinh, HocPhi, TrangThai, NamHoc, HocKi) VALUES
('HS001',5000000,'Đã nộp','2025-2026','1'),
('HS002',5000000,'Chưa nộp','2025-2026','1'),
('HS003',4500000,'Đã nộp','2025-2026','1');

INSERT INTO PhieuXinPhep (MaPhieu, LyDoNghi, Ngay, MaHocSinh) VALUES
('PX001','Bị ốm','2025-09-05','HS001'),
('PX002','Gia đình có việc','2025-09-06','HS002');

-- 7️⃣ HieuTruong
INSERT INTO HieuTruong (MaHieuTruong, TenHieuTruong, NgaySinh, GioiTinh, Email, SDT, NgayNhanChuc, DiaChi, GhiChu, ThoiGianCongTac, MaTruong)
VALUES
('HT001','Nguyen Van Hieu','1975-04-15','Nam','hieu1@gmail.com','0912111222','2010-09-01','123 Đường A, HCM','Tốt nghiệp ĐH Sư phạm','15','T01'),
('HT002','Tran Thi Hien','1978-08-20','Nữ','hien1@gmail.com','0912333444','2012-08-15','456 Đường B, HCM','Có kinh nghiệm quản lý','12','T02');


INSERT INTO YeuCauSuaDiem 
(MaYeuCau, TrangThai, DiemCu, DiemMoi, LyDo, MinhChung, MaHocSinh, LoaiDiem, Mon, NamHoc, HocKi, MaGiaoVien, MaHieuTruong)
VALUES
('YC001','DangXuLy',9,9.5,'Điểm 15 phút 1 sai','minhchung1.jpg','HS001','Diem15_1','Toán','2025-2026','1','GV001','HT001'),
('YC002','DangXuLy',8,8.5,'Điểm 15 phút 2 sai','minhchung2.jpg','HS002','Diem15_2','Toán','2025-2026','1','GV002','HT001'),
('YC003','DangXuLy',9,9.2,'Điểm 15 phút 1 sai','minhchung3.jpg','HS003','Diem15_1','Văn','2025-2026','1','GV003','HT001');

-- 5️⃣ ThiSinhDuThi, NguyenVong, KetQuaTuyenSinh, ChiTieu, PhongThi
INSERT INTO ThiSinhDuThi (MaThiSinh, HoTen, NgaySinh, Toan, Van, Anh, TuChon, NgayThi, SDT, Email, GioiTinh, TongDiem, NamThi)VALUES
('TS001','Nguyen Van A','2009-05-12',8,7,9,8,'2025-10-10','0912345678','ts001@gmail.com','Nam',32.00,'2025'),
('TS002','Tran Thi B','2009-07-20',7,8,8,9,'2025-10-11','0911223344','ts002@gmail.com','Nữ',32.00,'2025');

INSERT INTO NguyenVong (MaNguyenVong, MaThiSinh, MaTruong, ThuTuNguyenVong, ToHopMon, TrangThai) VALUES
('NV001','TS001','T01',1,'TH01','Đang xét'),
('NV002','TS002','T02',1,'TH02','Đang xét');

INSERT INTO KetQuaTuyenSinh (MaThiSinh, NguyenVongTrungTuyen, KhoaHoc, TinhTrang, DiemTrungTuyen, MaToHop) VALUES
('TS001','NV001','2025-2026','Chờ xét',32,'TH01'),
('TS002','NV002','2025-2026','Chờ xét',32,'TH02');

INSERT INTO ChiTieu (ChiTieu, NamThi, NgayLap, MaTruong, SoLuongCT) VALUES
('CT001','2025','2025-09-01 10:00:00','T01', 500),
('CT002','2026','2025-09-02 10:00:00','T02', 600);

INSERT INTO PhongThi (MaPhongThi, MaTruong, NgayThi, DiaDiemThi, MaGVCoiThi) VALUES
('PT001','T01','2025-10-10','Phòng 101','GV001'),
('PT002','T02','2025-10-11','Phòng 102','GV003');

-- 6️⃣ ThoiKhoaBieu
INSERT INTO ThoiKhoaBieu 
(LoaiTKB, MaLop, TenMonHoc, TietHoc, Thu, KyHoc, Ngay, MaGiaoVien, NamHoc)
VALUES
('Tuan1','L01','Toán',2,2,1,'2025-09-01','GV001','2025-2026'), -- Thứ 2
('Tuan1','L01','Lý',4,3,1,'2025-09-02','GV002','2025-2026'),   -- Thứ 3
('Tuan1','L01','Toán',2,4,1,'2025-09-03','GV001','2025-2026'), -- Thứ 4
('Tuan1','L01','Lý',4,5,1,'2025-09-04','GV002','2025-2026');   -- Thứ 5

-- 4️⃣ DiemDanh, Diem, HocPhi, PhieuXinPhep, YeuCauSuaDiem
INSERT INTO DiemDanh (MaHocSinh, TenMonHoc, Ngay, TrangThai, Tiet) VALUES
('HS001','Toán','2025-09-02','Có mặt',1),
('HS002','Toán','2025-09-02','Vắng',1),
('HS003','Văn','2025-09-02','Có mặt',1);

-- 8️⃣ HocBa
INSERT INTO HocBa (MaHocSinh, NamHoc, HocKy, HanhKiem, HocLuc, DiemTongKet, NhanXet, RenLuyen) VALUES
('HS001','2025-2026','1','Tốt','Giỏi',9.0,'Học sinh chăm ngoan, tích cực','Xuất sắc'),
('HS001','2025-2026','2','Khá','Giỏi',8.5,'Cần cải thiện môn Toán','Tốt'),
('HS002','2025-2026','1','Khá','Khá',8.0,'Học sinh có tiến bộ','Tốt'),
('HS002','2025-2026','2','Trung bình','Khá',7.5,'Cần chú ý môn Văn','Khá'),
('HS003','2025-2026','1','Tốt','Giỏi',9.2,'Tích cực tham gia lớp học','Xuất sắc'),
('HS003','2025-2026','2','Tốt','Giỏi',9.0,'Giữ vững phong độ học tập','Xuất sắc'),
('HS004','2025-2026','1','Khá','Khá',8.3,'Học sinh chăm ngoan','Tốt');

USE PTUD;
-- thêm dữ liệu ảo để kiểm tra TKB trống để lưu 
INSERT INTO MonHoc (TenMonHoc, SoTiet, MaToHop, TrangThai, Khoi)
VALUES ('EMPTY_WEEK', '0', 'TH01', 'Đang dạy', 'K01');

INSERT INTO GiaoVien (MaGiaoVien, TenGiaoVien, GioiTinh, NgaySinh, Email, SDT, TrinhDoChuyenMon, DiaChi, NgayVaoTruong, TrangThai, TenMonHoc, TinhTrangHonNhan, ChucVu, ThamNien, MaTruong)
VALUES ('GV000', 'GV Ảo', 'Nam', '2000-01-01', 'gv.ao@example.com', '0000000000', 'Cử nhân', 'HCM', '2025-09-01', 'Đang công tác', 'EMPTY_WEEK', 'Độc thân', 'Giáo viên', 0, 'T01');

-- 3️⃣ Thêm vào GVBoMon để thỏa FK
INSERT INTO GVBoMon (MaGVBM, MaLop, NamHoc, HocKy, BoMon)
VALUES ('GV000', 'L01', '2025-2026', '1', 'EMPTY_WEEK');

INSERT INTO ThoiKhoaBieu (LoaiTKB, MaLop, TenMonHoc, TietHoc, Thu, KyHoc, Ngay, MaGiaoVien, NamHoc)
VALUES ('TuanTest', 'L01', 'EMPTY_WEEK', 1, 2, 1, '2025-09-01', 'GV000', '2025-2026');

-- ==========================
-- TÀI KHOẢN THEO MÃ THỰC THỂ
-- ==========================
USE PTUD;
INSERT INTO TaiKhoan (TenTaiKhoan, MatKhau, LoaiTaiKhoan) VALUES
('TS001', '$2b$10$abc123fakehash1', 'Thí sinh'),
('HS001', '$2b$10$abc123fakehash2', 'Học sinh'),
('PH001', '$2b$10$abc123fakehash3', 'Phụ huynh'),
('GV001', '$2b$10$abc123fakehash4', 'Giáo viên'),
('GV002', '$2b$10$abc123fakehash5', 'Giáo viên'),
('GV003', '$2b$10$abc123fakehash6', 'Giáo viên'),
('GVU01', '$2b$10$abc123fakehash7', 'Giáo vụ'),
('HT001', '$2b$10$abc123fakehash8', 'Hiệu trưởng'),
('NV001', '$2b$10$abc123fakehash8', 'Cán bộ SGD'),
('QT001', '$2b$10$abc123fakehash8', 'Quản trị hệ thống');

USE PTUD;

UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'TS001';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'HS001';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'PH001';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'GV001';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'GV002';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'GV003';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'GVU01';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'HT001';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'NV001';
UPDATE TaiKhoan SET MatKhau = '123' WHERE TenTaiKhoan = 'QT001';
