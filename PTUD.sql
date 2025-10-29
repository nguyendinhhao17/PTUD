-- ==========================
-- 1. TẠO CSDL
-- ==========================
CREATE DATABASE IF NOT EXISTS PTUD
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE PTUD;

-- ==========================
-- 2. TẠO BẢNG (CỘT + KHÓA CHÍNH)
-- ==========================

CREATE TABLE Khoi (
    MaKhoi CHAR(5) PRIMARY KEY,
    TenKhoi VARCHAR(50) UNIQUE
);

CREATE TABLE ToHopMon (
    MaToHop CHAR(10) PRIMARY KEY,
    TenToHop VARCHAR(100) UNIQUE
);

CREATE TABLE HocKy (
    NamHoc CHAR(9) NOT NULL,
    KyHoc ENUM('1','2') NOT NULL,
    TrangThai ENUM('Đang học','Kết thúc','Chưa bắt đầu'),
    NgayBatDau DATE,
    NgayKetThuc DATE,
    PRIMARY KEY(NamHoc, KyHoc)
);

CREATE TABLE Truong (
    MaTruong CHAR(5) PRIMARY KEY,
    TenTruong VARCHAR(150),
    DiaChi VARCHAR(200),
    Email VARCHAR(100) UNIQUE,
    TrangThai BIT DEFAULT 1,
    SDT VARCHAR(20)
);

CREATE TABLE NamThi (
    TimeStart CHAR(4) PRIMARY KEY,
    TimeEnd CHAR(4)
);

CREATE TABLE MonHoc (
    TenMonHoc VARCHAR(100) PRIMARY KEY,
    SoTiet INT DEFAULT 0,
    MaToHop CHAR(10),
    TrangThai ENUM('Đang dạy','Ngưng dạy') DEFAULT 'Đang dạy',
    Khoi CHAR(5)
);

CREATE TABLE Lop (
    MaLop CHAR(5) PRIMARY KEY,
    TenLop VARCHAR(50),
    MaToHop CHAR(10),
    TrangThai ENUM('Đang học','Đã ra trường','Tạm ngưng') DEFAULT 'Đang học',
    Khoi CHAR(5),
    SiSo INT DEFAULT 0,
    MaTruong CHAR(5) NOT NULL
);

CREATE TABLE GiaoVien (
    MaGiaoVien CHAR(10) PRIMARY KEY,
    TenGiaoVien VARCHAR(100),
    GioiTinh ENUM('Nam','Nữ') DEFAULT 'Nam',
    NgaySinh DATE,
    Email VARCHAR(100) UNIQUE,
    SDT VARCHAR(15) UNIQUE,
    TrinhDoChuyenMon VARCHAR(100),
    DiaChi VARCHAR(255),
    NgayVaoTruong DATE,
    TrangThai ENUM('Đang công tác','Nghỉ việc','Tạm nghỉ') DEFAULT 'Đang công tác',
    TenMonHoc VARCHAR(100),
    TinhTrangHonNhan ENUM('Độc Thân','Đã Kết Hôn','Li Thân') DEFAULT 'Độc thân',
    ChucVu VARCHAR(50),
    ThamNien VARCHAR(20),
    MaTruong CHAR(5)
);

CREATE TABLE HieuTruong (
    MaHieuTruong CHAR(10) PRIMARY KEY,
    TenHieuTruong VARCHAR(100),
    NgaySinh DATE,
    GioiTinh ENUM('Nam','Nữ') DEFAULT 'Nam',
    Email VARCHAR(100) UNIQUE,
    SDT VARCHAR(15),
    NgayNhanChuc DATE,
    DiaChi VARCHAR(255),
    GhiChu TEXT,
    ThoiGianCongTac INT DEFAULT 0,
    MaTruong CHAR(5) NOT NULL
);

CREATE TABLE HocSinh (
    MaHocSinh CHAR(10) PRIMARY KEY,
    TenHocSinh VARCHAR(100),
    Birthday DATE,
    KhoaHoc VARCHAR(9),
    GioiTinh VARCHAR(10),
    TrangThai VARCHAR(20) DEFAULT 'Đang học',
    MaLop CHAR(5)
);

CREATE TABLE BaiTap (
    MaBaiTap CHAR(10) PRIMARY KEY,
    NoiDung TEXT,
    NgayGiao DATE,
    NgayHetHan DATE,
    MaLop CHAR(5),
    MaGiaoVien CHAR(10)
);

CREATE TABLE GVBoMon (
    MaGVBM CHAR(8),
    MaLop CHAR(5),
    NamHoc CHAR(9),
    HocKy ENUM('1','2') NOT NULL,
    BoMon VARCHAR(100),
    PRIMARY KEY(MaGVBM, MaLop, NamHoc, HocKy, BoMon)
);

CREATE TABLE GVChuNhiem (
    MaGVCN CHAR(8),
    MaLop CHAR(5),
    NamHoc CHAR(9),
    PRIMARY KEY(MaGVCN, MaLop, NamHoc)
);

CREATE TABLE PhuHuynh (
    HoTen VARCHAR(100),
    Email VARCHAR(100),
    SDT VARCHAR(12),
    MaHocSinh CHAR(10)
);

CREATE TABLE TaiKhoan (
    TenTaiKhoan VARCHAR(50) PRIMARY KEY,
    MatKhau VARCHAR(255),
    LoaiTaiKhoan VARCHAR(20)
);

CREATE TABLE ThoiKhoaBieu (
    LoaiTKB VARCHAR(20) NOT NULL,
    MaLop CHAR(5) NOT NULL,
    TenMonHoc VARCHAR(100) NOT NULL,
    TietHoc INT NOT NULL,
    KyHoc ENUM('1','2') NOT NULL,
    Thu ENUM('2','3','4','5','6','7','CN') NOT NULL,
    Ngay DATE,
    MaGiaoVien CHAR(10),
    NamHoc CHAR(9) NOT NULL,
    PRIMARY KEY (MaLop, LoaiTKB, Thu, TietHoc, TenMonHoc, Ngay)
);

CREATE TABLE DiemDanh (
    MaHocSinh CHAR(10),
    TenMonHoc VARCHAR(100),
    Ngay DATE,
    TrangThai VARCHAR(20),
    Tiet INT,
    PRIMARY KEY(MaHocSinh, TenMonHoc, Ngay, Tiet)
);

CREATE TABLE Diem (
    MaHocSinh CHAR(10) NOT NULL,
    TenMonHoc VARCHAR(100) NOT NULL,
    NamHoc CHAR(9) NOT NULL,
    HocKi ENUM('1','2') NOT NULL,
    ThuongXuyen1 DECIMAL(4,2),
    ThuongXuyen2 DECIMAL(4,2),
    ThuongXuyen3 DECIMAL(4,2),
    Diem15_1 DECIMAL(4,2),
    Diem15_2 DECIMAL(4,2),
    GK DECIMAL(4,2),
    CK DECIMAL(4,2),
    TrungBinhMon DECIMAL(4,2),
    PRIMARY KEY(MaHocSinh, TenMonHoc, NamHoc, HocKi)
);

CREATE TABLE HocPhi (
    MaHocSinh CHAR(10),
    HocPhi DECIMAL(18,0),
    TrangThai VARCHAR(50),
    NamHoc CHAR(9),
    HocKi ENUM('1','2')
);

CREATE TABLE PhieuXinPhep (
    MaPhieu CHAR(10) PRIMARY KEY,
    LyDoNghi TEXT,
    Ngay DATE,
    MaHocSinh CHAR(10)
);

CREATE TABLE YeuCauSuaDiem (
    MaYeuCau CHAR(12) PRIMARY KEY,
    MaHocSinh CHAR(10) NOT NULL,
    Mon VARCHAR(100) NOT NULL,
    NamHoc CHAR(9) NOT NULL,
    HocKi ENUM('1','2') NOT NULL,
    LoaiDiem VARCHAR(50) NOT NULL, -- xác định cột điểm sửa (ThuongXuyen1, GK, CK, ...)
    DiemCu DECIMAL(5,2),
    DiemMoi DECIMAL(5,2),
    LyDo VARCHAR(500),
    MinhChung VARCHAR(255),
    MaHieuTruong CHAR(10),
    MaGiaoVien CHAR(10),
    TrangThai VARCHAR(20) DEFAULT 'DangXuLy',
    GhiChu TEXT                -- cột ghi chú mới
);


CREATE TABLE ThiSinhDuThi (
    MaThiSinh CHAR(10) PRIMARY KEY,
    HoTen VARCHAR(100),
    NgaySinh DATE,
    Toan DECIMAL(4,2) DEFAULT 0,
    Van DECIMAL(4,2) DEFAULT 0,
    Anh DECIMAL(4,2) DEFAULT 0,
    TuChon DECIMAL(4,2) DEFAULT 0,
    NgayThi DATE,
    SDT VARCHAR(20),
    Email VARCHAR(100),
    GioiTinh VARCHAR(10),
    TongDiem DECIMAL(5,2) DEFAULT 0,
    NamThi CHAR(4)
);

CREATE TABLE NguyenVong (
    MaNguyenVong CHAR(5) PRIMARY KEY,
    MaThiSinh CHAR(10),
    MaTruong CHAR(5),
    ThuTuNguyenVong INT DEFAULT 1,
    ToHopMon CHAR(10),
    TrangThai VARCHAR(20) DEFAULT 'Đang xét'
);

CREATE TABLE KetQuaTuyenSinh (
    MaThiSinh CHAR(10) PRIMARY KEY,
    NguyenVongTrungTuyen CHAR(5),
    KhoaHoc VARCHAR(100),
    TinhTrang VARCHAR(50) DEFAULT 'Chờ xét',
    CHECK (TinhTrang IN ('Đậu','Rớt','Chờ xét')),
    DiemTrungTuyen DECIMAL(5,2) DEFAULT 0,
    CHECK (TinhTrang IN ('Đậu','Rớt','Chờ xét')),
    MaToHop CHAR(10)
);

CREATE TABLE ChiTieu (
    ChiTieu CHAR(10) PRIMARY KEY,
    NamThi CHAR(4),
    NgayLap DATETIME DEFAULT NOW(),
    MaTruong CHAR(5) NOT NULL,
    SoLuongCT INT
);

CREATE TABLE PhongThi (
    MaPhongThi CHAR(8) PRIMARY KEY,
    MaTruong CHAR(5),
    NgayThi DATE,
    DiaDiemThi VARCHAR(200),
    MaGVCoiThi CHAR(8)
);

CREATE TABLE HocBa (
    MaHocSinh CHAR(10) NOT NULL,
    NamHoc CHAR(9) NOT NULL,
    HocKy ENUM('1','2') NOT NULL,
    HanhKiem VARCHAR(20),
    HocLuc VARCHAR(20),
    DiemTongKet DECIMAL(4,2),
    NhanXet TEXT,
    RenLuyen VARCHAR(20),
    PRIMARY KEY(MaHocSinh, NamHoc, HocKy),
    CHECK (HanhKiem IN ('Tốt','Khá','Trung bình','Yếu')),
    CHECK (HocLuc IN ('Giỏi','Khá','Trung bình','Yếu')),
    CHECK (RenLuyen IN ('Xuất sắc','Tốt','Khá','Kém'))
);

-- ==========================
-- 3. THÊM KHÓA NGOẠI
-- ==========================

ALTER TABLE HocBa
ADD CONSTRAINT FK_HocBa_HS FOREIGN KEY (MaHocSinh) REFERENCES HocSinh(MaHocSinh),
ADD CONSTRAINT FK_HocBa_HocKy FOREIGN KEY (NamHoc, HocKy) REFERENCES HocKy(NamHoc, KyHoc);

ALTER TABLE MonHoc
ADD CONSTRAINT FK_MonHoc_ToHop FOREIGN KEY(MaToHop) REFERENCES ToHopMon(MaToHop),
ADD CONSTRAINT FK_MonHoc_Khoi FOREIGN KEY(Khoi) REFERENCES Khoi(MaKhoi);

ALTER TABLE Lop
ADD CONSTRAINT FK_Lop_ToHop FOREIGN KEY(MaToHop) REFERENCES ToHopMon(MaToHop),
ADD CONSTRAINT FK_Lop_Truong FOREIGN KEY(MaTruong) REFERENCES Truong(MaTruong),
ADD CONSTRAINT FK_Lop_Khoi FOREIGN KEY(Khoi) REFERENCES Khoi(MaKhoi);

ALTER TABLE GiaoVien
ADD CONSTRAINT FK_GiaoVien_Truong FOREIGN KEY (MaTruong) REFERENCES Truong(MaTruong),
ADD CONSTRAINT FK_GiaoVien_MonHoc FOREIGN KEY (TenMonHoc) REFERENCES MonHoc(TenMonHoc);

ALTER TABLE BaiTap
ADD CONSTRAINT FK_BaiTap_Lop FOREIGN KEY(MaLop) REFERENCES Lop(MaLop),
ADD CONSTRAINT FK_BaiTap_GV FOREIGN KEY(MaGiaoVien) REFERENCES GiaoVien(MaGiaoVien);

ALTER TABLE GVBoMon
ADD CONSTRAINT FK_GVBM_GV FOREIGN KEY (MaGVBM) REFERENCES GiaoVien(MaGiaoVien),
ADD CONSTRAINT FK_GVBM_Lop FOREIGN KEY (MaLop) REFERENCES Lop(MaLop),
ADD CONSTRAINT FK_GVBM_HocKy FOREIGN KEY (NamHoc, HocKy) REFERENCES HocKy(NamHoc, KyHoc);

ALTER TABLE GVChuNhiem
ADD CONSTRAINT FK_GVCN_GV FOREIGN KEY(MaGVCN) REFERENCES GiaoVien(MaGiaoVien),
ADD CONSTRAINT FK_GVCN_Lop FOREIGN KEY (MaLop) REFERENCES Lop(MaLop),
ADD CONSTRAINT FK_GVCN_NamHoc FOREIGN KEY (NamHoc) REFERENCES HocKy(NamHoc);

ALTER TABLE PhuHuynh
ADD CONSTRAINT FK_PhuHuynh_HS FOREIGN KEY(MaHocSinh) REFERENCES HocSinh(MaHocSinh);

ALTER TABLE DiemDanh
ADD CONSTRAINT FK_DiemDanh_HS FOREIGN KEY(MaHocSinh) REFERENCES HocSinh(MaHocSinh);
-- ADD CONSTRAINT FK_DiemDanh_TKB_MonHoc FOREIGN KEY(TenMonHoc) REFERENCES ThoiKhoaBieu(TenMonHoc);

ALTER TABLE Diem
ADD CONSTRAINT FK_Diem_HS FOREIGN KEY(MaHocSinh) REFERENCES HocSinh(MaHocSinh),
ADD CONSTRAINT FK_Diem_MonHoc FOREIGN KEY(TenMonHoc) REFERENCES MonHoc(TenMonHoc),
ADD CONSTRAINT FK_Diem_HocKy FOREIGN KEY(NamHoc, HocKi) REFERENCES HocKy(NamHoc, KyHoc);

ALTER TABLE HocPhi
ADD CONSTRAINT FK_HocPhi_HS FOREIGN KEY(MaHocSinh) REFERENCES HocSinh(MaHocSinh),
ADD CONSTRAINT FK_HocPhi_HocKy FOREIGN KEY(NamHoc, HocKi) REFERENCES HocKy(NamHoc, KyHoc);

ALTER TABLE PhieuXinPhep
ADD CONSTRAINT FK_PXP_HS FOREIGN KEY(MaHocSinh) REFERENCES HocSinh(MaHocSinh);

-- Thêm khóa ngoại
ALTER TABLE YeuCauSuaDiem
ADD CONSTRAINT FK_YC_HS FOREIGN KEY(MaHocSinh) REFERENCES HocSinh(MaHocSinh),
ADD CONSTRAINT FK_YC_MonHoc FOREIGN KEY(Mon) REFERENCES MonHoc(TenMonHoc),
ADD CONSTRAINT FK_YC_HieuTruong FOREIGN KEY(MaHieuTruong) REFERENCES HieuTruong(MaHieuTruong),
ADD CONSTRAINT FK_YC_GiaoVien FOREIGN KEY(MaGiaoVien) REFERENCES GiaoVien(MaGiaoVien),
ADD CONSTRAINT FK_YC_Diem FOREIGN KEY(MaHocSinh, Mon, NamHoc, HocKi)
    REFERENCES Diem(MaHocSinh, TenMonHoc, NamHoc, HocKi);

ALTER TABLE ThiSinhDuThi
ADD CONSTRAINT FK_ThiSinhDuThi_NamThi FOREIGN KEY(NamThi) REFERENCES NamThi(TimeStart);

ALTER TABLE NguyenVong
ADD CONSTRAINT FK_NguyenVong_ThiSinh FOREIGN KEY(MaThiSinh) REFERENCES ThiSinhDuThi(MaThiSinh),
ADD CONSTRAINT FK_NguyenVong_Truong FOREIGN KEY(MaTruong) REFERENCES Truong(MaTruong),
ADD CONSTRAINT FK_NguyenVong_ToHop FOREIGN KEY(ToHopMon) REFERENCES ToHopMon(MaToHop);

ALTER TABLE KetQuaTuyenSinh
ADD CONSTRAINT FK_KQTS_ThiSinh FOREIGN KEY(MaThiSinh) REFERENCES ThiSinhDuThi(MaThiSinh),
ADD CONSTRAINT FK_KQTS_NguyenVong FOREIGN KEY(NguyenVongTrungTuyen) REFERENCES NguyenVong(MaNguyenVong),
ADD CONSTRAINT FK_KQTS_ToHop FOREIGN KEY(MaToHop) REFERENCES ToHopMon(MaToHop);

ALTER TABLE ChiTieu
ADD CONSTRAINT FK_ChiTieu_Truong FOREIGN KEY(MaTruong) REFERENCES Truong(MaTruong),
ADD CONSTRAINT FK_ChiTieu_NamThi FOREIGN KEY (NamThi) REFERENCES NamThi(TimeStart);

ALTER TABLE PhongThi
ADD CONSTRAINT FK_PhongThi_Truong FOREIGN KEY(MaTruong) REFERENCES Truong(MaTruong),
ADD CONSTRAINT FK_PhongThi_GV FOREIGN KEY(MaGVCoiThi) REFERENCES GiaoVien(MaGiaoVien);

ALTER TABLE HieuTruong
ADD CONSTRAINT FK_HieuTruong_Truong FOREIGN KEY(MaTruong) REFERENCES Truong(MaTruong);

ALTER TABLE ThoiKhoaBieu
ADD CONSTRAINT FK_TKB_Lop FOREIGN KEY(MaLop) REFERENCES Lop(MaLop),
ADD CONSTRAINT FK_TKB_MonHoc FOREIGN KEY(TenMonHoc) REFERENCES MonHoc(TenMonHoc),
ADD CONSTRAINT FK_TKB_GVBM FOREIGN KEY(MaGiaoVien) REFERENCES GVBoMon(MaGVBM),
ADD CONSTRAINT FK_TKB_HocKy FOREIGN KEY(NamHoc, KyHoc) REFERENCES HocKy(NamHoc, KyHoc);
