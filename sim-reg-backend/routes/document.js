const express = require('express');
const router = express.Router();
const { createNewRequest } = require('../controllers/userController');
const upload = require('../middleware/multer');
const { indicateFileUploaded } = require('../controllers/userController');

router.post('/requests', createNewRequest);
router.post('/upload-documents', upload.fields([{ name: 'ktp', maxCount: 1 }, { name: 'kk', maxCount: 1 }]), indicateFileUploaded);

module.exports = router;
