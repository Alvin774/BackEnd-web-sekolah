const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');


// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api', uploadRoutes);

const sejarahRoutes = require('./routes/sejarahRoutes');
app.use('/api/sejarah', sejarahRoutes);


const prestasiRoutes = require('./routes/prestasiRoutes');
app.use('/api/prestasi', prestasiRoutes);

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

const sambutanRoutes = require('./routes/sambutanRoutes');
app.use('/api/sambutans', sambutanRoutes);

const extracurricularRoutes = require('./routes/extracurricularRoutes');
app.use('/api/extracurriculars', extracurricularRoutes);

const ppdbCarouselRoutes = require('./routes/ppdbCarouselRoutes');
app.use('/api/ppdbcarousel', ppdbCarouselRoutes);

const fasilitasRoutes = require('./routes/fasilitasRoutes');
app.use('/api/fasilitas', fasilitasRoutes);

const ppdbInfoRoutes = require('./routes/ppdbInfoRoutes');
app.use('/api/ppdbinfo', ppdbInfoRoutes);

const ppdbBrosurRoutes = require('./routes/ppdbBrosurRoutes');
app.use('/api/ppdbbrosur', ppdbBrosurRoutes);

const alurPendaftaranRoutes = require('./routes/alurPendaftaranRoutes');
app.use('/api/alurpendaftaran', alurPendaftaranRoutes);

const strukturOrganisasiRoutes = require('./routes/strukturOrganisasiRoutes');
app.use('/api/strukturorganisasi', strukturOrganisasiRoutes);

const dataSekolahRoutes = require('./routes/dataSekolahRoutes');
app.use('/api/data-sekolah', dataSekolahRoutes);

const pendaftaranRoutes = require('./routes/pendaftaranRoutes');
app.use('/api/pendaftaran', pendaftaranRoutes);

const statisticRoutes = require('./routes/statisticRoutes');
app.use('/api/statistics', statisticRoutes);



app.set('views', path.join(__dirname, 'public/ProjectWebSekolah'));


// Set static folder untuk front-end (misalnya, folder ProjectWebSekolah)
app.use(express.static(path.join(__dirname, 'public/ProjectWebSekolah')));


app.get('/', (req, res) => {
  res.render('index'); // akan mencari file views/index.ejs
});

app.get('/sambutan', (req, res) => {
  res.render('sambutan'); // akan mencari file views/index.ejs
});

app.get('/dats-sekolah', (req, res) => {
  res.render('data-sekolah'); // akan mencari file views/index.ejs
});

app.get('/sejarah', (req, res) => {
  res.render('sejarah'); // akan mencari file views/index.ejs
});

app.get('/visi-misi', (req, res) => {
  res.render('visi-misi-tujuan'); // akan mencari file views/index.ejs
});

app.get('/struktur-organisasi', (req, res) => {
  res.render('struktur-organisasi'); // akan mencari file views/index.ejs
});

app.get('/guru', (req, res) => {
  res.render('guru'); // akan mencari file views/index.ejs
});

app.get('/fasilitas', (req, res) => {
  res.render('fasilitas'); // akan mencari file views/index.ejs
});
app.get('/prestasi', (req, res) => {
  res.render('prestasi'); // akan mencari file views/index.ejs
});

app.get('/extrakurikuler', (req, res) => {
  res.render('extrakurikuler'); // akan mencari file views/index.ejs
});

app.get('/ppdb', (req, res) => {
  res.render('ppdb'); // akan mencari file views/index.ejs
});




// Mulai server setelah database disinkronkan
const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database terhubung');
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT}`);
    });
  })
  .catch(err => console.log('Error koneksi database: ', err));
