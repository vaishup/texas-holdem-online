const express = require('express');
const router = express.Router();
const validateToken = require('../../middleware/auth');
const { getTransactionHistory } = require('../../controllers/transaction');

router.get('/history', validateToken, getTransactionHistory);

module.exports = router;
