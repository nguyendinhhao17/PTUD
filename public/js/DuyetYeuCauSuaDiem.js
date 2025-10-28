// ==========================
// JS Quản lý Duyệt Yêu Cầu Sửa Điểm
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('detail-modal');
  const modalContent = document.getElementById('detail-content');
  const tableBody = document.querySelector('#requests-table tbody');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // ==========================
  // Tạo modal xác nhận
  // ==========================
  const confirmationModal = document.createElement('div');
  confirmationModal.className = 'modal confirmation-modal';
  confirmationModal.innerHTML = `
    <div class="modal-content">
      <h3 id="confirm-title"></h3>
      <p id="confirm-message"></p>
      <div class="modal-actions">
        <button id="confirm-yes" class="btn">Đồng ý</button>
        <button id="confirm-no" class="btn">Hủy</button>
      </div>
    </div>`;
  document.body.appendChild(confirmationModal);

  // ==========================
  // Helper hiển thị alert nhỏ trong modal
  // ==========================
  const renderAlert = (msg, type = 'info') =>
    `<div class="modal-alert modal-alert-${type}">${msg}</div>`;

  // ==========================
  // Render danh sách yêu cầu
  // ==========================
  function renderRequests(requests) {
    if (!requests || !requests.length) {
      tableBody.innerHTML = `<tr><td colspan="12" class="no-data">Không có yêu cầu</td></tr>`;
      return;
    }

    tableBody.innerHTML = requests
      .map(
        (r, i) => `
      <tr data-id="${r.MaYeuCau}">
        <td>${i + 1}</td>
        <input type="hidden" class="request-id value" value="${r.MaYeuCau}">
        <td>${r.MaYeuCau}</td>
        <td>${r.MaHocSinh}</td>
        <td>${r.TenHocSinh}</td>
        <td>${r.TenMonHoc}</td>
        <td>${r.LoaiDiem}</td>
        <td class="text-red">${r.DiemCu ?? '-'}</td>
        <td class="text-green">${r.DiemMoi ?? '-'}</td>
        <td>${r.LyDo || '-'}</td>
        <td>${r.TenGiaoVien || '-'}</td>
        <td class="status-cell" data-status="${r.TrangThai}">
          ${
            r.TrangThai === 'DaDuyet'
              ? 'Đã duyệt'
              : r.TrangThai === 'BiTuChoi'
              ? 'Bị từ chối'
              : 'Đang xử lý'
          }
        </td>
        <td class="action-cell">
          <button class="btn view-btn">Xem chi tiết</button>
        </td>
      </tr>`
      )
      .join('');
  }

  // ==========================
  // Load dữ liệu theo trạng thái
  // ==========================
  async function loadRequestsByStatus(status = 'DangXuLy') {
    try {
      tableBody.innerHTML = `<tr><td colspan="12">Đang tải...</td></tr>`;
      const url = status === 'All'
        ? `/api/duyetyeucausuadiem/filter/all`
        : `/api/duyetyeucausuadiem/filter/${status}`;
      const res = await fetch(url);
      const data = await res.json();
      renderRequests(data);
    } catch (err) {
      console.error(err);
      tableBody.innerHTML = `<tr><td colspan="12" class="error">Lỗi khi tải dữ liệu</td></tr>`;
    }
  }

  // ==========================
  // Hiển thị chi tiết yêu cầu
  // ==========================
  async function fetchRequestDetails(id) {
    modalContent.innerHTML = renderAlert('Đang tải chi tiết...', 'info');
    try {
      const res = await fetch(`/api/duyetyeucausuadiem/details/${id}`, { cache: 'no-store' });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const yc = data.request;
      const isPending = yc.TrangThai === 'DangXuLy';

      modalContent.innerHTML = `
        <p><strong>Giáo viên:</strong> ${yc.TenGiaoVien || '—'}</p>
        <p><strong>Học sinh:</strong> ${yc.TenHocSinh || '—'} (${yc.MaHocSinh || '—'})</p>
        <p><strong>Môn:</strong> ${yc.TenMonHoc || '—'}</p>
        <p><strong>Loại điểm:</strong> ${yc.LoaiDiem || '—'}</p>
        <p><strong>Điểm cũ:</strong> ${yc.DiemCu ?? '—'}</p>
        <p><strong>Điểm mới:</strong> ${yc.DiemMoi ?? '—'}</p>
        <p><strong>Lý do:</strong> ${yc.LyDo || '—'}</p>
        ${
          yc.MinhChung?.length
            ? `<p><strong>Minh chứng:</strong>
                <button class="view-proof btn" data-image="${yc.MinhChung[0]}">Xem minh chứng</button></p>`
            : ''
        }
        <div class="modal-actions">
          ${
            isPending
              ? `
              <button class="modal-approve btn" data-id="${id}">Duyệt</button>
              <button class="modal-reject btn" data-id="${id}">Từ chối</button>`
              : ''
          }
          <button class="modal-close btn">Đóng</button>
        </div>`;

      const approveBtn = modalContent.querySelector('.modal-approve');
      const rejectBtn = modalContent.querySelector('.modal-reject');
      const closeBtn = modalContent.querySelector('.modal-close');

      if (approveBtn) approveBtn.addEventListener('click', () => doApproveReject(id, 'approve'));
      if (rejectBtn)
        rejectBtn.addEventListener('click', async () => {
          const { value } = await Swal.fire({
            title: 'Lý do từ chối',
            input: 'textarea',
            inputPlaceholder: 'Nhập lý do từ chối...',
            showCancelButton: true,
            confirmButtonText: 'Từ chối',
            cancelButtonText: 'Hủy',
            inputValidator: v => !v && 'Vui lòng nhập lý do!'
          });
          if (value) await doApproveReject(id, 'reject', value);
        });

      closeBtn.addEventListener('click', () => (modal.style.display = 'none'));
    } catch (err) {
      console.error(err);
      modalContent.innerHTML = renderAlert('Lỗi khi tải chi tiết: ' + err.message, 'danger');
    }
  }


  // ==========================
  // Modal xác nhận hành động
  // ==========================
  function showConfirmationModal(title, message) {
    return new Promise(resolve => {
      const modal = document.querySelector('.confirmation-modal');
      modal.querySelector('#confirm-title').textContent = title;
      modal.querySelector('#confirm-message').textContent = message;
      modal.style.display = 'block';

      const yesBtn = modal.querySelector('#confirm-yes');
      const noBtn = modal.querySelector('#confirm-no');

      const cleanup = result => {
        modal.style.display = 'none';
        yesBtn.removeEventListener('click', onYes);
        noBtn.removeEventListener('click', onNo);
        resolve(result);
      };
      const onYes = () => cleanup(true);
      const onNo = () => cleanup(false);

      yesBtn.addEventListener('click', onYes);
      noBtn.addEventListener('click', onNo);
    });
  }

  // ==========================
  // Duyệt / Từ chối yêu cầu
  // ==========================
  async function doApproveReject(id, action, ghiChu = '') {
    const confirmed = await showConfirmationModal(
      action === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối',
      action === 'approve'
        ? 'Bạn có chắc muốn duyệt yêu cầu này?'
        : 'Bạn có chắc muốn từ chối yêu cầu này?'
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/duyetyeucausuadiem/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ghiChu })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      Swal.fire('Thành công', data.message, 'success');
      modal.style.display = 'none';

      const current = document.querySelector('.filter-btn.active')?.dataset.status || 'DangXuLy';
      await loadRequestsByStatus(current);
    } catch (err) {
      console.error(err);
      Swal.fire('Lỗi', err.message, 'error');
    }
  }

  // ==========================
  // Gắn sự kiện
  // ==========================
  if (modal && tableBody) {
    // Mở chi tiết yêu cầu
    tableBody.addEventListener('click', async e => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.dataset.id;
      if (e.target.classList.contains('view-btn')) {
        modal.style.display = 'block';
        await fetchRequestDetails(id);
      }
    });

    // Lọc trạng thái
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const status = btn.dataset.status;
        loadRequestsByStatus(status);
      });
    });

    // Đóng modal khi click ngoài
    window.onclick = e => {
      if (e.target === modal) modal.style.display = 'none';
    };

    // MẶC ĐỊNH: chỉ load "Đang xử lý"
    document.querySelector('.filter-btn[data-status="DangXuLy"]')?.classList.add('active');
    loadRequestsByStatus('DangXuLy');
  }
});
