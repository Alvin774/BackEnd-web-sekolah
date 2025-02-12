const textElement = document.getElementById("animated-text");
const text = "SMP Islam Sa'adatuddarain NW Majuwet";
let index = 0;
let isRemoving = false;
let delayAfterFullText = false;
let delayBeforeFullStack = document.getElementById("ppdb-section");

function animateText() {
  if (!delayAfterFullText) {
    if (!isRemoving && index < text.length) {
      // Menambahkan huruf satu per satu
      textElement.textContent += text[index];
      index++;
    } else if (isRemoving && index > 3) {
      // Menghapus huruf satu per satu kecuali "SMP"
      textElement.textContent = text.substring(0, index - 1);
      index--;
    } else if (isRemoving && index === 3) {
      // Memulai ulang animasi
      isRemoving = false;
    } else if (!isRemoving && index === text.length) {
      // Jika teks selesai ditampilkan, beri jeda 4 detik sebelum mulai menghapus
      delayAfterFullText = true;
      setTimeout(() => {
        isRemoving = true;
        delayAfterFullText = false;
      }, 6000); // Jeda 4 detik
    }
  }

  // Atur kecepatan animasi
  setTimeout(animateText, 150);
}

// Jalankan animasi teks
animateText();
