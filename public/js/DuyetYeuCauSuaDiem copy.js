document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('detail-modal');
  const modalContent = document.getElementById('detail-content');
  const closeModal = modal.querySelector('.close');
  const table = document.getElementById('requests-table');

  table.addEventListener('click', async e => {
    const tr = e.target.closest('tr');
    if(!tr) return;
    const id = tr.dataset.id;

    // Xem chi tiết
    if(e.target.classList.contains('view-btn')){
      try {
        const res = await fetch(`/api/duyetyeucausuadiem/details/${id}`);
        const data = await res.json();
        if(data.success){
          const yc = data.request;
          let minhChungHtml = '';
          if(yc.MinhChung.length){
            yc.MinhChung.forEach(img => {
              minhChungHtml += `<img src="/minhchung/${img}" style="max-width:100%;margin-top:5px;">`;
            });
          }
          modalContent.innerHTML = `
            <p><strong>Học sinh:</strong> ${yc.TenHocSinh} (${yc.MaHocSinh}, ${yc.GioiTinhHS}, Khóa: ${yc.KhoaHoc})</p>
            <p><strong>Môn học:</strong> ${yc.TenMonHoc}</p>
            <p><strong>Loại điểm:</strong> ${yc.LoaiDiem}</p>
            <p><strong>Điểm cũ:</strong> ${yc.DiemCu}</p>
            <p><strong>Điểm mới:</strong> ${yc.DiemMoi}</p>
            <p><strong>Lý do:</strong> ${yc.LyDo}</p>
            <p><strong>GV gửi:</strong> ${yc.TenGiaoVien} (Email: ${yc.EmailGV}, SDT: ${yc.SDTGV})</p>
            ${minhChungHtml}
          `;
          modal.style.display = 'block';
        } else alert(data.message);
      } catch(err){ console.error(err); alert('Lỗi server'); }
    }

    // Duyệt
    if(e.target.classList.contains('approve-btn')){
      if(!confirm('Bạn có chắc muốn duyệt?')) return;
      try {
        const res = await fetch('/api/duyetyeucausuadiem/approve',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({id})
        });
        const data = await res.json();
        alert(data.message);
        if(data.success) location.reload();
      } catch(err){ console.error(err); alert('Lỗi server'); }
    }

    // Từ chối
    if(e.target.classList.contains('reject-btn')){
      if(!confirm('Bạn có chắc muốn từ chối?')) return;
      try {
        const res = await fetch('/api/duyetyeucausuadiem/reject',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({id})
        });
        const data = await res.json();
        alert(data.message);
        if(data.success) location.reload();
      } catch(err){ console.error(err); alert('Lỗi server'); }
    }
  });

  // Đóng modal
  closeModal.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if(e.target === modal) modal.style.display = 'none'; };
});
