const express = require('express');
const router = express.Router();
const { createNewRequest } = require('../controllers/userController');

router.post('/requests', createNewRequest);

module.exports = router;
