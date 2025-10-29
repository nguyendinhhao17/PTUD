let danhSachHocPhi = [];
let danhSachPhiDaChon = [];

document.addEventListener('DOMContentLoaded', function() {
    layDanhSachHocPhi();

    document.getElementById('selectHocKy').addEventListener('change', function() {
        hienThiDanhSachPhi();
    });

    document.getElementById('btnThanhToan').addEventListener('click', function() {
        xuLyThanhToan();
    });
});

async function layDanhSachHocPhi() {
    try {
        const response = await fetch('/thanhtoan/api/danh-sach-hoc-phi');
        const result = await response.json();

        if (result.success) {
            danhSachHocPhi = result.data;
            hienThiDanhSachHocKy();
        } else {
            alert('Không thể tải danh sách học phí');
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Có lỗi xảy ra khi tải danh sách học phí');
    }
}

function hienThiDanhSachHocKy() {
    const selectHocKy = document.getElementById('selectHocKy');
    selectHocKy.innerHTML = '<option value="">Chọn học kỳ...</option>';

    const danhSachHocKyUnique = [...new Set(danhSachHocPhi.map(hp => `${hp.namHoc} - Học kỳ ${hp.hocKi}`))];

    danhSachHocKyUnique.forEach(hocKy => {
        const option = document.createElement('option');
        option.value = hocKy;
        option.textContent = hocKy;
        selectHocKy.appendChild(option);
    });
}

function hienThiDanhSachPhi() {
    const selectHocKy = document.getElementById('selectHocKy').value;
    const danhSachPhiDiv = document.getElementById('danhSachPhi');

    if (!selectHocKy) {
        danhSachPhiDiv.innerHTML = '<p class="empty-message">Vui lòng chọn học kỳ để xem danh sách học phí</p>';
        capNhatThongTinThanhToan();
        return;
    }

    const [namHoc, hocKyText] = selectHocKy.split(' - ');
    const hocKi = hocKyText.replace('Học kỳ ', '');

    const hocPhiTheoKy = danhSachHocPhi.filter(hp => hp.namHoc === namHoc && hp.hocKi === hocKi);

    if (hocPhiTheoKy.length === 0) {
        danhSachPhiDiv.innerHTML = '<p class="empty-message">Không có công nợ</p>';
        capNhatThongTinThanhToan();
        return;
    }

    danhSachPhiDiv.innerHTML = '';

    hocPhiTheoKy.forEach(hp => {
        const feeItem = document.createElement('div');
        feeItem.className = 'fee-item';
        feeItem.dataset.namhoc = hp.namHoc;
        feeItem.dataset.hocki = hp.hocKi;

        feeItem.innerHTML = `
            <div class="fee-item-header">
                <input type="checkbox" class="fee-checkbox" id="fee-main-${hp.namHoc}-${hp.hocKi}">
                <div class="fee-title">Học kỳ ${hp.hocKi} - ${hp.namHoc}</div>
                <div class="fee-amount">${formatCurrency(hp.hocPhi)} VNĐ</div>
            </div>
            <div class="fee-details">
                <div class="fee-detail-item">
                    <input type="checkbox" class="fee-detail-checkbox" data-type="hocPhiHocKy" data-amount="${hp.hocPhiHocKy}">
                    <span class="fee-detail-label">Học phí học kỳ</span>
                    <span class="fee-detail-amount">${formatCurrency(hp.hocPhiHocKy)} VNĐ</span>
                </div>
                <div class="fee-detail-item">
                    <input type="checkbox" class="fee-detail-checkbox" data-type="phiTaiLieu" data-amount="${hp.phiTaiLieu}">
                    <span class="fee-detail-label">Phí tài liệu</span>
                    <span class="fee-detail-amount">${formatCurrency(hp.phiTaiLieu)} VNĐ</span>
                </div>
                <div class="fee-detail-item">
                    <input type="checkbox" class="fee-detail-checkbox" data-type="phiBaoHiem" data-amount="${hp.phiBaoHiem}">
                    <span class="fee-detail-label">Phí bảo hiểm</span>
                    <span class="fee-detail-amount">${formatCurrency(hp.phiBaoHiem)} VNĐ</span>
                </div>
                <div class="fee-detail-item">
                    <input type="checkbox" class="fee-detail-checkbox" data-type="phiHoatDongNgoaiKhoa" data-amount="${hp.phiHoatDongNgoaiKhoa}">
                    <span class="fee-detail-label">Phí hoạt động ngoại khóa</span>
                    <span class="fee-detail-amount">${formatCurrency(hp.phiHoatDongNgoaiKhoa)} VNĐ</span>
                </div>
            </div>
        `;

        danhSachPhiDiv.appendChild(feeItem);

        const mainCheckbox = feeItem.querySelector('.fee-checkbox');
        const detailCheckboxes = feeItem.querySelectorAll('.fee-detail-checkbox');

        mainCheckbox.addEventListener('change', function() {
            detailCheckboxes.forEach(cb => {
                cb.checked = mainCheckbox.checked;
            });
            if (mainCheckbox.checked) {
                feeItem.classList.add('selected');
            } else {
                feeItem.classList.remove('selected');
            }
            capNhatDanhSachPhiDaChon();
        });

        detailCheckboxes.forEach(cb => {
            cb.addEventListener('change', function() {
                const allChecked = Array.from(detailCheckboxes).every(checkbox => checkbox.checked);
                const someChecked = Array.from(detailCheckboxes).some(checkbox => checkbox.checked);

                mainCheckbox.checked = allChecked;

                if (someChecked) {
                    feeItem.classList.add('selected');
                } else {
                    feeItem.classList.remove('selected');
                }

                capNhatDanhSachPhiDaChon();
            });
        });
    });
}

function capNhatDanhSachPhiDaChon() {
    danhSachPhiDaChon = [];

    const feeItems = document.querySelectorAll('.fee-item');

    feeItems.forEach(item => {
        const namHoc = item.dataset.namhoc;
        const hocKi = item.dataset.hocki;
        const detailCheckboxes = item.querySelectorAll('.fee-detail-checkbox:checked');

        if (detailCheckboxes.length > 0) {
            const phiItem = {
                namHoc,
                hocKi,
                hocPhiHocKy: 0,
                phiTaiLieu: 0,
                phiBaoHiem: 0,
                phiHoatDongNgoaiKhoa: 0
            };

            detailCheckboxes.forEach(cb => {
                const type = cb.dataset.type;
                const amount = parseFloat(cb.dataset.amount);
                phiItem[type] = amount;
            });

            danhSachPhiDaChon.push(phiItem);
        }
    });

    capNhatThongTinThanhToan();
}

function capNhatThongTinThanhToan() {
    const thongTinDiv = document.getElementById('thongTinThanhToan');
    const tongTienSpan = document.getElementById('tongTien');
    const tongTienButtonSpan = document.getElementById('tongTienButton');
    const btnThanhToan = document.getElementById('btnThanhToan');

    if (danhSachPhiDaChon.length === 0) {
        thongTinDiv.innerHTML = '<p class="info-message">Vui lòng chọn học kỳ và các khoản phí để xem thông tin thanh toán</p>';
        tongTienSpan.textContent = '0';
        tongTienButtonSpan.textContent = '0';
        btnThanhToan.disabled = true;
        return;
    }

    let tongTien = 0;
    let html = '';

    danhSachPhiDaChon.forEach(phi => {
        const tongPhiKy = phi.hocPhiHocKy + phi.phiTaiLieu + phi.phiBaoHiem + phi.phiHoatDongNgoaiKhoa;
        tongTien += tongPhiKy;

        html += `
            <div class="info-row">
                <span class="info-label">Học kỳ:</span>
                <span class="info-value">${phi.hocKi} - ${phi.namHoc}</span>
            </div>
        `;

        if (phi.hocPhiHocKy > 0) {
            html += `
                <div class="info-row">
                    <span class="info-label">Học phí học kỳ:</span>
                    <span class="info-value">${formatCurrency(phi.hocPhiHocKy)} VNĐ</span>
                </div>
            `;
        }

        if (phi.phiTaiLieu > 0) {
            html += `
                <div class="info-row">
                    <span class="info-label">Phí tài liệu:</span>
                    <span class="info-value">${formatCurrency(phi.phiTaiLieu)} VNĐ</span>
                </div>
            `;
        }

        if (phi.phiBaoHiem > 0) {
            html += `
                <div class="info-row">
                    <span class="info-label">Phí bảo hiểm:</span>
                    <span class="info-value">${formatCurrency(phi.phiBaoHiem)} VNĐ</span>
                </div>
            `;
        }

        if (phi.phiHoatDongNgoaiKhoa > 0) {
            html += `
                <div class="info-row">
                    <span class="info-label">Phí hoạt động ngoại khóa:</span>
                    <span class="info-value">${formatCurrency(phi.phiHoatDongNgoaiKhoa)} VNĐ</span>
                </div>
            `;
        }
    });

    html += `
        <div class="info-row">
            <span class="info-label">Tổng tiền:</span>
            <span class="info-value">${formatCurrency(tongTien)} VNĐ</span>
        </div>
    `;

    thongTinDiv.innerHTML = html;
    tongTienSpan.textContent = formatCurrency(tongTien);
    tongTienButtonSpan.textContent = formatCurrency(tongTien);
    btnThanhToan.disabled = false;
}

async function xuLyThanhToan() {
    if (danhSachPhiDaChon.length === 0) {
        alert('Vui lòng chọn các khoản phí cần thanh toán');
        return;
    }

    const phuongThuc = document.querySelector('input[name="phuongThuc"]:checked').value;
    const tongTien = danhSachPhiDaChon.reduce((tong, phi) => {
        return tong + phi.hocPhiHocKy + phi.phiTaiLieu + phi.phiBaoHiem + phi.phiHoatDongNgoaiKhoa;
    }, 0);

    const phiDauTien = danhSachPhiDaChon[0];

    try {
        const response = await fetch('/thanhtoan/api/thanh-toan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                namHoc: phiDauTien.namHoc,
                hocKi: phiDauTien.hocKi,
                danhSachPhi: danhSachPhiDaChon,
                phuongThucThanhToan: phuongThuc,
                tongTien: tongTien
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Thanh toán thành công!\nMã giao dịch: ' + result.maGiaoDich);
            window.location.reload();
        } else {
            alert('Thanh toán thất bại: ' + result.message);
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Thanh toán thất bại do lỗi hệ thống');
    }
}

function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}
