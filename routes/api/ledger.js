const express = require('express');
const router = express.Router();
const validateToken = require('../../middleware/auth');
const { getPlayerLedger } = require('../../controllers/ledger');

router.get('/', validateToken, getPlayerLedger);
router.get('/history', validateToken, getPlayerLedger);
router.get('/transaction/history', validateToken, getPlayerLedger);

module.exports = router;
