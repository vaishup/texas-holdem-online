const mockDataStore = require('../utils/mockData');
const { asyncHandler, NotFoundError } = require('../utils/errors');
const { sendSuccess } = require('../utils/response');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../utils/constants');

/**
 * @route   GET api/ledger
 * @route   GET api/transaction/history
 * @desc    Get read-only player ledger transactions
 * @access  Private
 */
exports.getPlayerLedger = asyncHandler(async (req, res) => {
  const user = mockDataStore.users.findById(req.user.id);

  if (!user) {
    throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const transactions = mockDataStore.ledger.findByUserId(req.user.id);
  const balance = transactions.reduce((total, transaction) => total + transaction.amount, 0);

  return sendSuccess(
    res,
    {
      userId: user.id,
      playerName: user.name,
      balance,
      currency: 'chips',
      transactions,
    },
    'Ledger retrieved successfully',
    HTTP_STATUS.OK,
  );
});
