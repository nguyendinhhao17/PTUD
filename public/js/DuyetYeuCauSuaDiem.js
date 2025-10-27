// Chắc chắn DOM đã render xong
const modal = document.getElementById('detail-modal');
const modalContent = document.getElementById('detail-content');
const closeModal = modal.querySelector('.close');
const table = document.getElementById('requests-table');

console.log('JS loaded', modal, table); // debug

if(modal && table){
  table.addEventListener('click', async e => {
    const tr = e.target.closest('tr');
    if(!tr) return;
    const id = tr.dataset.id;

    // Hiển thị modal
    if(e.target.classList.contains('view-btn')){
      modalContent.innerHTML = `<p>Loading chi tiết yêu cầu: ${id}</p>`; // tạm
      modal.style.display = 'block';

      // Sau này có thể fetch API
      /*
      try {
        const res = await fetch(`/api/duyetyeucausuadiem/details/${id}`);
        const data = await res.json();
        if(data.success){
          const yc = data.request;
          modalContent.innerHTML = `
            <p><strong>Học sinh:</strong> ${yc.TenHocSinh} (${yc.MaHocSinh})</p>
            ...
          `;
        }
      } catch(err){ console.error(err); }
      */
    }

    if(e.target.classList.contains('approve-btn')){
      if(confirm('Bạn có chắc muốn duyệt?')) console.log('Duyệt', id);
    }

    if(e.target.classList.contains('reject-btn')){
      if(confirm('Bạn có chắc muốn từ chối?')) console.log('Từ chối', id);
    }
  });

  closeModal.onclick = () => modal.style.display = 'none';
  window.onclick = e => { if(e.target === modal) modal.style.display='none'; };
}
