// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Menetapkan folder static yang berisi file index.html
app.use(express.static(path.join(__dirname, 'public/ProjectWebSekolah')));


// Opsional: Jika kamu ingin memastikan saat akses root ('/')
// mengirim file index.html, kamu bisa menambahkan route berikut:
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/ProjectWebSekolah', 'index.html'));
});

// Menyajikan file statis dari folder "public"


const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);

// Daftarkan routes prestasi
const prestasiRoutes = require('./routes/prestasiRoutes');
app.use('/api/prestasi', prestasiRoutes);

//index
const newsRoutes = require('./routes/newsRoutes');
app.use('/api/news', newsRoutes);

const bannerRoutes = require('./routes/bannerRoutes');
app.use('/api/banner', bannerRoutes);

const announcementRoutes = require('./routes/announcementRoutes');
app.use('/api/announcements', announcementRoutes);

const alumniReviewRoutes = require('./routes/alumniReviewRoutes');
app.use('/api/alumniReview', alumniReviewRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);


const guruRoutes = require('./routes/guruRoutes');
app.use('/api/guru', guruRoutes);

// Daftarkan routes sambutan
const sambutanRoutes = require('./routes/sambutanRoutes');
app.use('/api/sambutans', sambutanRoutes);

const extracurricularRoutes = require('./routes/extracurricularRoutes.js');
app.use('/api/extracurriculars', extracurricularRoutes);

// Daftarkan routes PPDB Carousel
const ppdbCarouselRoutes = require('./routes/ppdbCarouselRoutes');
app.use('/api/ppdbcarousel', ppdbCarouselRoutes);

const fasilitasRoutes = require('./routes/fasilitasRoutes');
app.use('/api/fasilitas', fasilitasRoutes);

// Mendaftarkan route PPDB Info
const ppdbInfoRoutes = require('./routes/ppdbInfoRoutes');
app.use('/api/ppdbinfo', ppdbInfoRoutes);

// Mendaftarkan route PPDB Brosur
const ppdbBrosurRoutes = require('./routes/ppdbBrosurRoutes');
app.use('/api/ppdbbrosur', ppdbBrosurRoutes);

// Mendaftarkan route Alur Pendaftaran
const alurPendaftaranRoutes = require('./routes/alurPendaftaranRoutes');
app.use('/api/alurpendaftaran', alurPendaftaranRoutes);

const strukturOrganisasiRoutes = require('./routes/strukturOrganisasiRoutes');
app.use('/api/strukturorganisasi', strukturOrganisasiRoutes);

// Daftarkan routes data sekolah
// Daftarkan routes data sekolah
const dataSekolahRoutes = require('./routes/dataSekolahRoutes');
app.use('/api/data-sekolah', dataSekolahRoutes);

const pendaftaranRoutes = require('./routes/pendaftaranRoutes');
app.use('/api/pendaftaran', pendaftaranRoutes);

// Endpoint dasar (bisa diarahkan ke front-end utama)
app.get('/', (req, res) => {
  // Mengarahkan ke file index.html dari folder front-end
  res.sendFile(path.join(__dirname, 'public', 'back-end-smp-nw-majuwet', 'index.html'));
});

const statisticRoutes = require('./routes/statisticRoutes');
app.use('/api/statistics', statisticRoutes);
// Sinkronisasi database dan jalankan server
const PORT = process.env.PORT || 56059 ;
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database terhubung');
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  })
  .catch(err => console.log('Error koneksi database: ', err));
