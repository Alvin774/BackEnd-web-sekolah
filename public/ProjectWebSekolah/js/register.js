// public/back-end-smp-nw-majuwet/js/register.js

document.getElementById('form-register').addEventListener('click', async function (e) {
    e.preventDefault(); // Mencegah aksi default (jika berada dalam form)
  
    // Mengambil nilai input dari form register
    const name = document.getElementById('exampleFormControlInput1').value.trim();
    const email = document.getElementById('exampleFormControlInput2').value.trim();
    const password = document.getElementById('exampleFormControlInput3').value;
    const confirmPassword = document.getElementById('exampleFormControlInput4').value;
  
    // Validasi sederhana
    if (!name || !email || !password || !confirmPassword) {
      alert('Semua field harus diisi!');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Password dan Confirm Password tidak cocok!');
      return;
    }
  
    try {
      // Pastikan URL mengarah ke server backend yang benar (misalnya port 3000)
      const response = await fetch('http://127.0.0.1:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: name, email: email, password: password })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // Misalnya "User berhasil dibuat"
        // Setelah registrasi berhasil, alihkan ke halaman login
        window.location.href = 'login.html';
      } else {
        alert(result.message || 'Registrasi gagal.');
      }
    } catch (error) {
      console.error('Error saat registrasi:', error);
      alert('Terjadi kesalahan pada server.');
    }
  });
  