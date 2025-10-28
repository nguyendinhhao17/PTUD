const TaiKhoan = require('../models/DangNhapModel');

class DangNhapController {
  renderLogin(req, res) {
    res.render('pages/dangnhap', { title: 'Đăng nhập hệ thống', user: null });
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
      }

      const user = await TaiKhoan.login(username, password);

      if (!user) {
        return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
      }

      // Map vai trò và lưu session
     let role;
if (user.LoaiTaiKhoan === 'HieuTruong') {
  role = 'Hiệu trưởng';
} else if (user.LoaiTaiKhoan === 'GiaoVien') {
  role = 'Giáo viên';
} else if (user.LoaiTaiKhoan === 'HocSinh') {
  role = 'Học sinh';
} else if (user.LoaiTaiKhoan === 'GiaoVu') {
  role = 'Giáo vụ';
} else if (user.LoaiTaiKhoan === 'PhuHuynh') {
  role = 'Phụ huynh';
} else if (user.LoaiTaiKhoan === 'QuanTriVien') {
  role = 'Quản trị hệ thống';
} else if (user.LoaiTaiKhoan === 'CanBoSGD') {   // Thêm dòng này
  role = 'Cán bộ SGD';
} else {
  role = user.LoaiTaiKhoan;
}

      // Lưu session với đầy đủ thông tin cần thiết
      req.session.user = {
        username: user.TenTaiKhoan, // TenTaiKhoan chính là mã người dùng
        role: role,
        isAuthenticated: true,
        LoaiTaiKhoan: user.LoaiTaiKhoan
      };

      return res.json({ success: true, message: "Đăng nhập thành công", redirect: '/' });

    } catch (err) {
      console.error("💥 Lỗi đăng nhập:", err);
      return res.json({ success: false, message: "Lỗi server, thử lại sau" });
    }
  }

  logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error("❌ Lỗi destroy session:", err);
        return res.json({ success: false, message: "Không thể đăng xuất" });
      }
      res.redirect('/');
    });
  }
}

module.exports = new DangNhapController();
