const express = require('express');
const xemthongkeketqua = require('../controllers/XemThongKeKetQuaController');
const router = express.Router();

router.get('/render', xemthongkeketqua.renderPage);