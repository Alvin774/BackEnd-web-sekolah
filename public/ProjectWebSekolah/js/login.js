// public/back-end-smp-nw-majuwet/js/login.js

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Mencegah submit form secara default
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://127.0.0.1:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Login berhasil: simpan token dan alihkan ke halaman profil
        localStorage.setItem('token', data.token);
        alert('Login berhasil!');
        window.location.href = 'index.html'; // atau halaman lain yang diinginkan
      } else {
        // Tampilkan pesan error dari server
        alert(data.message || 'Login gagal');
      }
    } catch (error) {
      console.error('Terjadi error saat login:', error);
      alert('Terjadi kesalahan, silakan coba lagi.');
    }
  });
  