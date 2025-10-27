// Chắc chắn DOM đã render xong
const modal = document.getElementById('detail-modal');
const modalContent = document.getElementById('detail-content');
const table = document.getElementById('requests-table');

// Tạo modal xác nhận
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
  </div>
`;
document.body.appendChild(confirmationModal);

console.log('JS loaded', modal, table); // debug

// Helper: render a simple alert area inside the modal
function renderAlert(message, type = 'info'){
  return `<div class="modal-alert modal-alert-${type}">${message}</div>`;
}

// Helper: update a table row's status and action cells
function updateRowStatus(tr, status){
  if(!tr) return;
  
  // 1. Find and update status cell (index 10 in our table)
  const cells = tr.querySelectorAll('td');
  const statusCell = cells[10]; // Trạng thái là cột thứ 11 (index 10)
  if(statusCell) {
    statusCell.textContent = status;
    statusCell.dataset.status = status;
  }

  // 2. Update action buttons cell (last cell)
  const actionCell = cells[cells.length - 1];
  if(actionCell) {
    // Xóa các nút cũ và thay bằng "Đã xử lý"
    actionCell.innerHTML = '<em>Đã xử lý</em>';
  }
  
  // 3. Optional: Add visual feedback
  tr.classList.add('updated');
  setTimeout(() => tr.classList.remove('updated'), 2000);
}

async function fetchRequestDetails(id){
  modalContent.innerHTML = renderAlert('Đang tải chi tiết...', 'info');
  try{
    const res = await fetch(`/api/duyetyeucausuadiem/details/${id}`, {cache: 'no-store'});
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if(!data || !data.success) throw new Error(data?.message || 'Lỗi khi lấy dữ liệu');

    const yc = data.request;
    // render detail view (adjust fields according to API)
      modalContent.innerHTML = `
        <p><strong>Giáo viên:</strong> ${yc.TenGiaoVien || yc.GiaoVien || '—'}</p>
        <p><strong>Học sinh:</strong> ${yc.TenHocSinh || '—'} (${yc.MaHocSinh || '—'})</p>
        <p><strong>Lớp:</strong> ${yc.TenLop || '—'}</p>
        <p><strong>Môn:</strong> ${yc.TenMonHoc || yc.Mon || '—'}</p>
        <p><strong>Năm học:</strong> ${yc.NamHoc || '—'}</p>
        <p><strong>Học kỳ:</strong> ${yc.HocKi || '—'}</p>
        <p><strong>Điểm cũ:</strong> ${yc.DiemCu ?? '—'}</p>
        <p><strong>Điểm đề xuất:</strong> ${yc.DiemMoi ?? '—'}</p>
        <p><strong>Lý do:</strong> ${yc.LyDo || '—'}</p>
        ${yc.MinhChung ? `
        <p>
          <strong>Minh chứng:</strong>
          <button class="view-proof btn" data-image="${yc.MinhChung}">
            Xem minh chứng
          </button>
        </p>
        ` : ''}
        <div class="modal-actions">
          <button class="modal-approve btn" data-id="${id}">Duyệt</button>
          <button class="modal-reject btn" data-id="${id}">Từ chối</button>
          <button class="modal-close btn">Đóng</button>
        </div>

        <!-- Image Modal -->
        <div id="proof-modal" class="modal" style="display: none;">
          <div class="modal-content">
            <span class="close">&times;</span>
            <img id="proof-image" src="" alt="Minh chứng" style="width: 100%; max-height: 80vh; object-fit: contain;">
          </div>
        </div>
      `;


    // attach modal internal handlers
    const approveBtn = modalContent.querySelector('.modal-approve');
    const rejectBtn = modalContent.querySelector('.modal-reject');
    const closeBtn = modalContent.querySelector('.modal-close');
    const viewProofBtn = modalContent.querySelector('.view-proof');
    const proofModal = modalContent.querySelector('#proof-modal');
    const proofImage = modalContent.querySelector('#proof-image');
    const proofClose = proofModal?.querySelector('.close');

    // Xử lý nút xem minh chứng
    if (viewProofBtn && proofModal && proofImage) {
      viewProofBtn.addEventListener('click', () => {
        const imageName = viewProofBtn.dataset.image;
        proofImage.src = `/minhchung/${imageName}`;
        proofModal.style.display = 'block';

        // Đóng modal minh chứng
        proofClose.onclick = () => proofModal.style.display = 'none';
        window.onclick = e => {
          if (e.target === proofModal) {
            proofModal.style.display = 'none';
          }
        };

        // Xử lý lỗi load ảnh
        proofImage.onerror = () => {
          proofImage.src = ''; // clear failed image
          proofModal.innerHTML = renderAlert('Không thể tải ảnh minh chứng', 'danger');
        };
      });
    }

    approveBtn && approveBtn.addEventListener('click', async () => {
      await doApproveReject(id, 'approve', true);
    });

    rejectBtn && rejectBtn.addEventListener('click', async () => {
      await doApproveReject(id, 'reject', true);
    });

    closeBtn && closeBtn.addEventListener('click', () => { 
      if(modal) modal.style.display='none';
    });

  }catch(err){
    console.error(err);
    modalContent.innerHTML = renderAlert('Không thể tải chi tiết: ' + (err.message || err), 'danger');
  }
}

function showConfirmationModal(title, message) {
  return new Promise((resolve) => {
    const modal = document.querySelector('.confirmation-modal');
    const titleEl = modal.querySelector('#confirm-title');
    const messageEl = modal.querySelector('#confirm-message');
    const yesBtn = modal.querySelector('#confirm-yes');
    const noBtn = modal.querySelector('#confirm-no');

    titleEl.textContent = title;
    messageEl.textContent = message;
    modal.style.display = 'block';

    const handleResponse = (result) => {
      modal.style.display = 'none';
      yesBtn.removeEventListener('click', handleYes);
      noBtn.removeEventListener('click', handleNo);
      resolve(result);
    };

    const handleYes = () => handleResponse(true);
    const handleNo = () => handleResponse(false);

    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
  });
}

async function doApproveReject(id, action, isFromModal = false){
  // action = 'approve' or 'reject'
  const endpoint = `/api/duyetyeucausuadiem/${action}`;
  
  // Find table row and disable all its buttons
  const tr = document.querySelector(`tr[data-id="${id}"]`);
  const allButtons = [
    ...Array.from(tr?.querySelectorAll('button') || []),
    ...Array.from(modalContent?.querySelectorAll('button') || [])
  ];
  
  // Show confirmation modal
  const title = action === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối';
  const message = action === 'approve' 
    ? 'Bạn có chắc muốn duyệt yêu cầu này?' 
    : 'Bạn có chắc muốn từ chối yêu cầu này?';
  
  const confirmed = await showConfirmationModal(title, message);
  if (!confirmed) return;
  
  // Disable all related buttons during processing
  allButtons.forEach(b => b.disabled = true);
  
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id })
    });
    
    if(!res.ok) {
      throw new Error(res.status === 401 ? 'Vui lòng đăng nhập lại' : `Lỗi ${res.status}`);
    }
    
    const data = await res.json();
    if(!data.success) {
      throw new Error(data.message || 'Thao tác thất bại');
    }

    // Update table row with new status
    const newStatus = action === 'approve' ? 'Đã duyệt' : 'Đã từ chối';
    updateRowStatus(tr, newStatus);

    // Show success message and reload page
    const successMsg = data.message || `Đã ${action === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu thành công`;
    
    if(isFromModal) {
      // If action was from modal, show success in modal
      modalContent.innerHTML = renderAlert(successMsg, 'success');
      setTimeout(() => {
        if(modal) modal.style.display = 'none';
        window.location.reload(); // Reload page after modal closes
      }, 800);
    } else {
      // If action was from table buttons, show floating alert
      const alert = document.createElement('div');
      alert.className = 'floating-alert success';
      alert.textContent = successMsg;
      document.body.appendChild(alert);
      setTimeout(() => {
        alert.remove();
        window.location.reload(); // Reload page after alert disappears
      }, 1000);
    }
    
  } catch(err) {
    console.error('Lỗi khi xử lý yêu cầu:', err);
    const errorMsg = err.message || 'Đã xảy ra lỗi khi xử lý';
    
    if(isFromModal) {
      modalContent.insertAdjacentHTML('afterbegin', renderAlert(errorMsg, 'danger'));
    } else {
      const alert = document.createElement('div');
      alert.className = 'floating-alert error';
      alert.textContent = errorMsg;
      document.body.appendChild(alert);
      setTimeout(() => alert.remove(), 3000);
    }
    
    // Re-enable buttons on error so user can retry
    allButtons.forEach(b => b.disabled = false);
  }
}

if(modal && table){
  table.addEventListener('click', async e => {
    const tr = e.target.closest('tr');
    if(!tr) return;
    const id = tr.dataset.id;

    // Hiển thị modal khi nhấn view
    if(e.target.classList.contains('view-btn')){
      if(modal) modal.style.display = 'block';
      await fetchRequestDetails(id);
    }

    // approve/reject buttons that may live in the row (delegated)
    if(e.target.classList.contains('approve-btn')){
      await doApproveReject(id, 'approve', false);
    }

    if(e.target.classList.contains('reject-btn')){
      await doApproveReject(id, 'reject', false);
    }
  });

  const closeModal = modal.querySelector('.close');
  if(closeModal) closeModal.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if(e.target === modal) modal.style.display='none'; };
}
