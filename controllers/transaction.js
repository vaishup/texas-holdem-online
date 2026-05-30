const mockDataStore = require('../utils/mockData');
const { asyncHandler, NotFoundError } = require('../utils/errors');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

/**
 * @route   GET api/transaction/history
 * @desc    Get read-only player ledger transaction history
 * @access  Private
 */
exports.getTransactionHistory = asyncHandler(async (req, res) => {
  const user = mockDataStore.users.findById(req.user.id);

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const transactions = mockDataStore.playerLedger.findByUserId(user.id);
  const balance = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  return sendSuccess(
    res,
    {
      userId: user.id,
      playerName: user.name,
      currency: 'chips',
      balance,
      transactions,
    },
    'Transaction history retrieved successfully',
    HTTP_STATUS.OK,
  );
});
