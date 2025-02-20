/* =================== Animation Text on Home Banner =================== */

// Function to animate text letter by letter
function animateText(elementId, text, delay = 80) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = ""; // Clear existing text
  element.style.visibility = "visible"; // Make element visible
  let i = 0;
  function typeLetter() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeLetter, delay);
    }
  }
  typeLetter();
}

/* =================== Function to Animate News Cards =================== */
function initNewsCardsAnimation() {
  const newsCards = document.querySelectorAll(".berita-artikel .card");
  const newsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running";
          newsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  newsCards.forEach((card) => {
    card.style.animationPlayState = "paused";
    newsObserver.observe(card);
  });
}

/* =================== Function to Animate 'Mengapa Memilih' Cards =================== */
function initMengapaPilihAnimation() {
  const cards = document.querySelectorAll(".mengapa-pilih .card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const index = [...cards].indexOf(card);
          card.style.setProperty("--delay", `${index * 0.5}s`);
          card.classList.add("show");
          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((card) => {
    observer.observe(card);
  });
}

/* =================== Function to Animate Pengumuman Cards =================== */
function initAnnouncementsCardsAnimation() {
  const cards = document.querySelectorAll(".pengumuman-agenda .card");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  cards.forEach((card) => {
    observer.observe(card);
  });
}

/* =================== Function to Animate Statistik Counters =================== */
function initCounters() {
  const counters = document.querySelectorAll(".counter");
  const options = { threshold: 0.5 };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.getAttribute("data-target");
        let current = 0;
        const increment = target / 230;
        function updateCounter() {
          current += increment;
          if (current < target) {
            counter.innerText = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            counter.innerText = target;
          }
        }
        updateCounter();
        counterObserver.unobserve(counter);
      }
    });
  }, options);
  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
}

/* =================== Function to Load News =================== */
async function loadNews() {
  try {
    const response = await fetch('https://smpsaadatuddarainnw.up.railway.app/api/news');
    const newsList = await response.json();
    const newsContainer = document.querySelector('.berita-artikel .row');
    if (newsContainer) {
      newsContainer.innerHTML = "";
      newsList.forEach(news => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('col-12', 'col-sm-12', 'col-md-6', 'col-xl-4');
        newsCard.innerHTML = `
          <div class="card h-100">
            <img src="${news.imageUrl}" class="card-img-top" alt="Berita Image" />
            <div class="card-body">
              <p class="card-text">${news.description}</p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
              <a href="#" class="btn btn-success">Lihat Selengkapnya</a>
              <small class="text-muted">${new Date(news.uploadTime).toLocaleString()}</small>
            </div>
          </div>
        `;
        newsContainer.appendChild(newsCard);
      });
    }
  } catch (error) {
    console.error('Error loading news:', error);
  }
}

/* =================== Function to Load Banner =================== */
async function loadBanner() {
  try {
    const response = await fetch('/api/banner');
    const data = await response.json();
    const banner = Array.isArray(data) ? data[0] : data;
    if (banner && banner.imageUrl) {
      const bannerContainer = document.getElementById('bannerContainer');
      if (!bannerContainer) {
        console.error('Element with id "bannerContainer" not found.');
        return;
      }
      let bannerHTML = "";
      if (banner.linkUrl) {
        bannerHTML = `
          <a href="${banner.linkUrl}" target="_blank">
            <img id="bannerImage" src="${banner.imageUrl}" alt="PPDB Banner" class="img-fluid" />
          </a>
        `;
      } else {
        bannerHTML = `<img id="bannerImage" src="${banner.imageUrl}" alt="PPDB Banner" class="img-fluid" />`;
      }
      bannerContainer.innerHTML = bannerHTML;
    }
  } catch (error) {
    console.error("Error loading banner:", error);
  }
}

async function loadAnnouncements() {
  try {
    const response = await fetch('/api/announcements');
    if (!response.ok) {
      throw new Error('Failed to fetch announcements');
    }
    const announcements = await response.json();

    const container = document.getElementById('announcementsContainer');
    if (!container) {
      console.error('Element with id "announcementsContainer" not found.');
      return;
    }
    
    // Kosongkan kontainer terlebih dahulu
    container.innerHTML = "";

    // Array nama bulan dalam bahasa Indonesia
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    // Jika tidak ada data pengumuman, tampilkan pesan
    if (!announcements.length) {
      container.innerHTML = '<p class="text-center">Tidak ada pengumuman.</p>';
      return;
    }

    announcements.forEach(announcement => {
      const d = new Date(announcement.eventDate);
      const day = d.getDate();
      const month = monthNames[d.getMonth()];
      const year = d.getFullYear();
      const fullDate = d.toLocaleDateString('id-ID');

      const cardDiv = document.createElement('div');
      cardDiv.className = 'col-lg-12 mb-4';
      cardDiv.innerHTML = `
        <div class="d-flex flex-column flex-md-row align-items-stretch shadow-sm rounded">
          <div class="date-box bg-success text-white text-center d-flex flex-column align-items-center justify-content-center">
            <span class="ukuran-1 fw-bold">${day}</span>
            <span class="ukuran-2">${month}</span>
            <span class="ukuran-3">${year}</span>
          </div>
          <div class="content-box bg-white p-4 rounded-end flex-grow-1">
            <h5 class="fw-bold">${announcement.title}</h5>
            <p class="mb-1">${announcement.content}</p>
            <p class="mb-0"><i class="bi bi-calendar-event"></i> ${fullDate}</p>
            ${announcement.eventTime ? `<p><i class="bi bi-clock"></i> ${announcement.eventTime}</p>` : ''}
          </div>
        </div>
      `;
      container.appendChild(cardDiv);
    });
  } catch (error) {
    console.error("Error loading announcements:", error);
    alert("Terjadi kesalahan saat memuat pengumuman.");
  }
}
/* =================== DOMContentLoaded =================== */
document.addEventListener("DOMContentLoaded", () => {
  // Animate texts on home banner
  const text1 = "Selamat Datang di SMP Islam Sa'adatuddarain NW Majuwet";
  const text2 = "Sa'adatuddarain: Pendidikan Cerdas Untuk Kehidupan Bahagia Dunia dan Akhirat";
  animateText("animated-text", text1, 80);
  setTimeout(() => {
    animateText("animated-subtext", text2, 80);
  }, text1.length * 80 + 500);

  // Initialize animations for cards and counters
  initNewsCardsAnimation();
  initMengapaPilihAnimation();
  initAnnouncementsCardsAnimation();
  initCounters();

  // Load dynamic content
  loadNews();
  loadBanner();
  loadAnnouncements();
});


async function loadStatistics() {
  try {
    const response = await fetch('/api/statistics');
    if (!response.ok) {
      throw new Error('Failed to fetch statistics');
    }
    const stat = await response.json();
    // Update counter values berdasarkan urutan: siswa, gedung, guru & staff, prestasi.
    const counters = document.querySelectorAll(".counter");
    if (counters.length >= 4) {
      counters[0].setAttribute("data-target", stat.siswa);
      counters[0].innerText = stat.siswa; // langsung set nilai
      counters[1].setAttribute("data-target", stat.gedung);
      counters[1].innerText = stat.gedung;
      counters[2].setAttribute("data-target", stat.guruStaff);
      counters[2].innerText = stat.guruStaff;
      counters[3].setAttribute("data-target", stat.prestasi);
      counters[3].innerText = stat.prestasi;
    }
  } catch (error) {
    console.error("Error loading statistics:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadStatistics);



async function loadAlumniReviews() {
  try {
    const response = await fetch('/api/alumniReview');
    if (!response.ok) {
      throw new Error('Failed to fetch alumni reviews');
    }
    const reviews = await response.json();
    const carouselInner = document.querySelector('#carouselAlumni .carousel-inner');
    if (!carouselInner) {
      console.error("Element .carousel-inner tidak ditemukan");
      return;
    }
    
    // Kosongkan kontainer terlebih dahulu
    carouselInner.innerHTML = "";

    if (reviews.length === 0) {
      // Jika tidak ada data, tampilkan item dengan pesan fallback
      carouselInner.innerHTML = `
        <div class="carousel-item active">
          <div class="row justify-content-center">
            <div class="review-card col-12 col-md-8 col-lg-6">
              <div class="card-body">
                <p class="text-center">Tidak ada review alumni.</p>
              </div>
            </div>
          </div>
        </div>
      `;
      return;
    }

    reviews.forEach((review, index) => {
      // Tentukan apakah item pertama diberi kelas active
      const activeClass = index === 0 ? " active" : "";
      const carouselItem = document.createElement('div');
      carouselItem.className = "carousel-item" + activeClass;
      carouselItem.innerHTML = `
        <div class="row justify-content-center">
          <div class="review-card col-12 col-md-8 col-lg-6">
            <div class="card-body">
              <p class="text-content">"${review.review}"</p>
              <div class="alumni-bio d-flex align-items-center">
                <img src="${review.imageUrl ? review.imageUrl : 'img/default-alumni.jpg'}" alt="Alumni" class="alumni-photo rounded-circle shadow" />
                <div class="ms-4">
                  <h5 class="alumni-name">${review.alumniName}</h5>
                  <p class="alumni-year">Alumni Tahun ${review.alumniYear}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      carouselInner.appendChild(carouselItem);
    });
  } catch (error) {
    console.error("Error loading alumni reviews:", error);
    alert("Terjadi kesalahan saat memuat alumni reviews.");
  }
}

// Panggil fungsi loadAlumniReviews saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadAlumniReviews);
