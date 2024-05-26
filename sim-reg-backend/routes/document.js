const express = require('express');
const router = express.Router();
const { indicateFileUploaded, createNewRequest } = require('../controllers/userController');

router.post('/requests', createNewRequest);
router.post('/upload-document', indicateFileUploaded);

module.exports = router;
