document.addEventListener('DOMContentLoaded', () => {
  const approveBtns = document.querySelectorAll('.approve-btn');
  const rejectBtns = document.querySelectorAll('.reject-btn');
  const viewBtns = document.querySelectorAll('.view-btn');
  const modal = document.getElementById('detail-modal');
  const modalContent = document.getElementById('detail-content');
  const closeModal = modal.querySelector('.close');

  // Duyệt yêu cầu
  approveBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if(confirm('Xác nhận duyệt yêu cầu này?')) await updateRequestStatus(id, 'approve');
    });
  });

  // Từ chối yêu cầu
  rejectBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if(confirm('Bạn chắc chắn muốn từ chối yêu cầu này?')) await updateRequestStatus(id, 'reject');
    });
  });

  // Xem chi tiết
  viewBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      try {
        const res = await fetch(`/duyetyeucau/details/${id}`);
        const data = await res.json();
        if(data.success) {
          const yc = data.request;
          modalContent.innerHTML = `
            <p><strong>Học sinh:</strong> ${yc.TenHocSinh} (${yc.MaHocSinh}, ${yc.GioiTinhHS}, Khóa: ${yc.KhoaHoc})</p>
            <p><strong>Môn học:</strong> ${yc.TenMonHoc}</p>
            <p><strong>Loại điểm:</strong> ${yc.LoaiDiem}</p>
            <p><strong>Điểm cũ:</strong> ${yc.DiemCu}</p>
            <p><strong>Điểm mới:</strong> ${yc.DiemMoi}</p>
            <p><strong>Lý do:</strong> ${yc.LyDo}</p>
            <p><strong>Giáo viên gửi:</strong> ${yc.TenGiaoVien} (Email: ${yc.EmailGV}, SDT: ${yc.SDTGV})</p>
          `;
          modal.style.display = 'block';
        } else alert('Không lấy được chi tiết');
      } catch(err) {
        console.error(err);
        alert('Lỗi khi lấy chi tiết');
      }
    });
  });

  closeModal.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if(e.target === modal) modal.style.display = 'none'; };
});

// Hàm update trạng thái
async function updateRequestStatus(id, action) {
  const url = action === 'approve' ? '/duyetyeucau/approve' : '/duyetyeucau/reject';
  try {
    const res = await fetch(url, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if(data.success) {
      alert(data.message);
      location.reload();
    } else alert('Thao tác thất bại: ' + data.message);
  } catch(err) {
    console.error(err);
    alert('Lỗi server khi cập nhật trạng thái');
  }
}
