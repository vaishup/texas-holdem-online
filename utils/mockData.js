const config = require('../config');

/**
 * In-memory mock data store for demo purposes
 * This replaces database operations for the demo project
 */

let users = [];
let ledgerTransactions = [];
let nextUserId = 1;
let nextTransactionId = 1;

const createLedgerTransaction = (userId, label, amount, timestamp, metadata = {}) => ({
  id: `tx-${String(nextTransactionId++).padStart(3, '0')}`,
  userId: String(userId),
  label,
  amount,
  timestamp,
  type: amount >= 0 ? 'credit' : 'debit',
  metadata,
});

const ledgerTemplates = [
  [
    {
      label: 'Welcome bonus chips',
      amount: 25000,
      timestamp: '2026-05-30T13:10:00Z',
      metadata: { source: 'promotion' },
    },
    {
      label: 'Buy-in: Table 1 (Vintage Stakes)',
      amount: -5000,
      timestamp: '2026-05-30T13:18:22Z',
      metadata: { tableId: 1 },
    },
    {
      label: 'Pair of kings pot win',
      amount: 3825,
      timestamp: '2026-05-30T13:26:41Z',
      metadata: { tableId: 1, handId: 'demo-hand-kings' },
    },
    {
      label: 'Big blind posted',
      amount: -100,
      timestamp: '2026-05-30T13:31:08Z',
      metadata: { tableId: 1, blind: 'big' },
    },
    {
      label: 'Rebuy at Table 1',
      amount: -2500,
      timestamp: '2026-05-30T13:44:15Z',
      metadata: { tableId: 1, source: 'rebuy' },
    },
    {
      label: 'Flush showdown win',
      amount: 6900,
      timestamp: '2026-05-30T13:58:49Z',
      metadata: { tableId: 1, handId: 'demo-hand-flush' },
    },
    {
      label: 'Daily login reward',
      amount: 1500,
      timestamp: '2026-05-30T14:05:00Z',
      metadata: { source: 'daily-reward' },
    },
  ],
  [
    {
      label: 'Referral reward',
      amount: 10000,
      timestamp: '2026-05-29T20:15:00Z',
      metadata: { source: 'referral' },
    },
    {
      label: 'Tournament entry: Friday Freeroll',
      amount: -3000,
      timestamp: '2026-05-29T20:30:00Z',
      metadata: { tournamentId: 'friday-freeroll' },
    },
    {
      label: 'Tournament prize: 6th place',
      amount: 8750,
      timestamp: '2026-05-29T21:42:18Z',
      metadata: { tournamentId: 'friday-freeroll', place: 6 },
    },
    {
      label: 'Small blind posted',
      amount: -50,
      timestamp: '2026-05-29T22:01:12Z',
      metadata: { tableId: 1, blind: 'small' },
    },
    {
      label: 'Straight draw called and lost',
      amount: -1400,
      timestamp: '2026-05-29T22:09:37Z',
      metadata: { tableId: 1, handId: 'demo-hand-straight-draw' },
    },
    {
      label: 'Cashout to wallet',
      amount: -4500,
      timestamp: '2026-05-29T22:20:05Z',
      metadata: { source: 'wallet' },
    },
  ],
  [
    {
      label: 'Initial chips grant',
      amount: config.INITIAL_CHIPS_AMOUNT,
      timestamp: '2026-05-28T16:00:00Z',
      metadata: { source: 'registration' },
    },
    {
      label: 'Buy-in: Heads-up Practice',
      amount: -1000,
      timestamp: '2026-05-28T16:08:11Z',
      metadata: { tableId: 1, mode: 'practice' },
    },
    {
      label: 'All-in loss',
      amount: -2400,
      timestamp: '2026-05-28T16:19:30Z',
      metadata: { tableId: 1, handId: 'demo-hand-all-in-loss' },
    },
    {
      label: 'Free chips top-up',
      amount: 5000,
      timestamp: '2026-05-28T16:25:00Z',
      metadata: { source: 'free-chips' },
    },
    {
      label: 'Three of a kind pot win',
      amount: 3150,
      timestamp: '2026-05-28T16:40:42Z',
      metadata: { tableId: 1, handId: 'demo-hand-trips' },
    },
    {
      label: 'Table stand-up refund',
      amount: 1725,
      timestamp: '2026-05-28T16:51:09Z',
      metadata: { tableId: 1, source: 'stand-up' },
    },
  ],
];

const createSampleLedgerTransactions = (userId) => {
  const templateIndex = (Number(userId) - 1) % ledgerTemplates.length;
  return ledgerTemplates[templateIndex].map((transaction) =>
    createLedgerTransaction(
      userId,
      transaction.label,
      transaction.amount,
      transaction.timestamp,
      transaction.metadata,
    ),
  );
};

/**
 * Initialize mock data with demo users
 */
const initializeMockData = () => {
  users = [
    {
      id: '1',
      name: 'Demo Player 1',
      email: 'player1@demo.com',
      password: 'hashed_password_demo', // In production, this would be hashed
      chipsAmount: config.INITIAL_CHIPS_AMOUNT,
      type: 0,
      created: new Date(),
    },
    {
      id: '2',
      name: 'Demo Player 2',
      email: 'player2@demo.com',
      password: 'hashed_password_demo',
      chipsAmount: config.INITIAL_CHIPS_AMOUNT,
      type: 0,
      created: new Date(),
    },
  ];
  nextUserId = 3;
  nextTransactionId = 1;
  ledgerTransactions = [
    ...createSampleLedgerTransactions('1'),
    ...createSampleLedgerTransactions('2'),
  ];
};

// Initialize on module load
initializeMockData();

/**
 * Mock Data Store
 * Provides database-like operations for demo purposes
 */
const mockDataStore = {
  users: {
    /**
     * Find user by ID
     * @param {string} id - User ID
     * @returns {Object|null} User object or null
     */
    findById: (id) => {
      if (!id) return null;
      return users.find((user) => user.id === String(id)) || null;
    },

    /**
     * Find user by query (email or name)
     * @param {Object} query - Query object with email or name
     * @returns {Object|null} User object or null
     */
    findOne: (query) => {
      if (!query) return null;

      if (query.email) {
        return users.find((user) => user.email.toLowerCase() === query.email.toLowerCase().trim()) || null;
      }
      if (query.name) {
        return users.find((user) => user.name.toLowerCase() === query.name.toLowerCase().trim()) || null;
      }
      return null;
    },

    /**
     * Create new user
     * @param {Object} userData - User data object
     * @returns {Object} Created user object
     */
    create: (userData) => {
      if (!userData || !userData.email || !userData.name) {
        throw new Error('Invalid user data');
      }

      const newUser = {
        id: String(nextUserId++),
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        password: userData.password,
        chipsAmount: userData.chipsAmount || config.INITIAL_CHIPS_AMOUNT,
        type: userData.type || 0,
        created: new Date(),
      };

      users.push(newUser);
      ledgerTransactions.push(...createSampleLedgerTransactions(newUser.id));
      return newUser;
    },

    /**
     * Update user by ID
     * @param {string} id - User ID
     * @param {Object} updateData - Data to update
     * @returns {Object|null} Updated user object or null
     */
    update: (id, updateData) => {
      if (!id || !updateData) return null;

      const userIndex = users.findIndex((user) => user.id === String(id));
      if (userIndex === -1) return null;

      // Merge update data with existing user
      users[userIndex] = {
        ...users[userIndex],
        ...updateData,
        // Preserve immutable fields
        id: users[userIndex].id,
        created: users[userIndex].created,
      };

      return users[userIndex];
    },

    /**
     * Get user without sensitive password field
     * @param {Object} user - User object
     * @returns {Object|null} User object without password
     */
    getUserWithoutPassword: (user) => {
      if (!user) return null;
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    },

    /**
     * Get all users (for admin purposes)
     * @returns {Array} Array of users without passwords
     */
    findAll: () => {
      return users.map((user) => mockDataStore.users.getUserWithoutPassword(user));
    },

    /**
     * Reset mock data to initial state
     */
    reset: () => {
      initializeMockData();
    },
  },
  ledger: {
    /**
     * Find ledger transactions by user ID, newest first
     * @param {string} userId - User ID
     * @returns {Array} User transactions
     */
    findByUserId: (userId) => {
      if (!userId) return [];
      return ledgerTransactions
        .filter((transaction) => transaction.userId === String(userId))
        .map(({ userId: _userId, ...transaction }) => transaction);
    },

    /**
     * Add a ledger transaction for a user
     * @param {string} userId - User ID
     * @param {Object} transactionData - Transaction data
     * @returns {Object} Created transaction
     */
    create: (userId, transactionData) => {
      if (!userId || !transactionData || !transactionData.label) {
        throw new Error('Invalid ledger transaction data');
      }

      const transaction = createLedgerTransaction(
        userId,
        transactionData.label,
        Number(transactionData.amount || 0),
        transactionData.timestamp || new Date().toISOString(),
        transactionData.metadata || {},
      );

      ledgerTransactions.unshift(transaction);
      const { userId: _userId, ...publicTransaction } = transaction;
      return publicTransaction;
    },
  },
};

module.exports = mockDataStore;
