const express = require('express');
const router = express.Router();
const { getRequest, processRequest } = require('../controllers/adminController');

// Mendapatkan semua permintaan pendaftar
router.get('/requests', getRequest);
// Memproses permintaan pendaftar
router.put('/requests/process', processRequest);

module.exports = router;
