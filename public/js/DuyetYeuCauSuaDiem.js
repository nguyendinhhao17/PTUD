document.addEventListener('DOMContentLoaded', () => {
  const approveBtns = document.querySelectorAll('.approve-btn');
  const rejectBtns = document.querySelectorAll('.reject-btn');

  approveBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Xác nhận duyệt yêu cầu này?')) {
        await updateRequestStatus(id, 'Đã duyệt');
      }
    });
  });

  rejectBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      if (confirm('Bạn chắc chắn muốn từ chối yêu cầu này?')) {
        await updateRequestStatus(id, 'Từ chối');
      }
    });
  });
});

async function updateRequestStatus(id, status) {
  try {
    const res = await fetch('/duyetyeucau/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    });

    const data = await res.json();
    alert(data.message);
    if (data.success) location.reload();
  } catch (err) {
    alert('Lỗi khi cập nhật trạng thái.');
    console.error(err);
  }
}
