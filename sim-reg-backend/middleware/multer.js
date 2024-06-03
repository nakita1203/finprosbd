// const multer = require('multer');
// const path = require('path');

// // Konfigurasi penyimpanan untuk multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//     cb(null, 'uploads/');  // Menyimpan file di folder 'uploads'
//     },
//     filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//     }
// });

// // Membuat instance upload dengan konfigurasi penyimpanan
// const upload = multer({ storage: storage });

// module.exports = upload;
