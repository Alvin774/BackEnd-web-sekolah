// js/guru.js

// Fungsi untuk memuat data guru dari API dan menampilkannya di halaman
async function loadGuru() {
    try {
      const response = await fetch('/api/guru');
      if (!response.ok) {
        throw new Error('Failed to fetch guru data');
      }
      const gurus = await response.json();
      const container = document.getElementById('guruList');
      if (!container) {
        console.error('Element with id "guruList" not found');
        return;
      }
      container.innerHTML = ""; // Bersihkan kontainer
  
      if (gurus.length === 0) {
        container.innerHTML = "<p class='text-center'>Tidak ada data guru.</p>";
        return;
      }
  
      gurus.forEach(guru => {
        const card = document.createElement('div');
        card.className = "col-6 col-md-4 col-lg-3"; // Atur layout sesuai grid
        card.innerHTML = `
          <div class="card text-center shadow-sm">
            <img src="${guru.imageUrl ? guru.imageUrl : 'img/default-guru.jpg'}" class="card-img-top " alt="Foto Guru">
            <div class="card-body">
              <h6 class="card-title fw-bold mb-1">${guru.name}</h6>
              <p class="text-muted mb-1">NIP: ${guru.nip ? guru.nip : '-'}</p>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } catch (error) {
      console.error("Error loading guru:", error);
      alert("Terjadi kesalahan saat memuat data guru.");
    }
  }
  
  // Panggil fungsi loadGuru ketika DOM telah selesai dimuat
  document.addEventListener("DOMContentLoaded", loadGuru);
  