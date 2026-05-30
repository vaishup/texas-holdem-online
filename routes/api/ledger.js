const express = require('express');
const router = express.Router();
const validateToken = require('../../middleware/auth');
const { getPlayerLedger } = require('../../controllers/ledger');

router.get('/', validateToken, getPlayerLedger);

module.exports = router;
