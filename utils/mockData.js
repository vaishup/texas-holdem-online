const config = require('../config');

/**
 * In-memory mock data store for demo purposes
 * This replaces database operations for the demo project
 */

let users = [];
let playerLedgerTransactions = [];
let nextUserId = 1;

const ledgerTemplates = [
  [
    {
      id: 'tx-001',
      label: 'Initial chips grant',
      amount: config.INITIAL_CHIPS_AMOUNT,
      timestamp: '2026-05-28T16:00:00Z',
      type: 'credit',
      metadata: { source: 'registration' },
    },
    {
      id: 'tx-002',
      label: 'Buy-in: Heads-up Practice',
      amount: -1000,
      timestamp: '2026-05-28T16:08:11Z',
      type: 'debit',
      metadata: { tableId: 1, mode: 'practice' },
    },
    {
      id: 'tx-003',
      label: 'All-in loss',
      amount: -2400,
      timestamp: '2026-05-28T16:19:30Z',
      type: 'debit',
      metadata: { tableId: 1, handId: 'demo-hand-all-in-loss' },
    },
    {
      id: 'tx-004',
      label: 'Free chips top-up',
      amount: 5000,
      timestamp: '2026-05-28T16:25:00Z',
      type: 'credit',
      metadata: { source: 'free-chips' },
    },
    {
      id: 'tx-005',
      label: 'Three of a kind pot win',
      amount: 3150,
      timestamp: '2026-05-28T16:40:42Z',
      type: 'credit',
      metadata: { tableId: 1, handId: 'demo-hand-trips' },
    },
    {
      id: 'tx-006',
      label: 'Table stand-up refund',
      amount: 1725,
      timestamp: '2026-05-28T16:51:09Z',
      type: 'credit',
      metadata: { tableId: 1, source: 'stand-up' },
    },
  ],
  [
    {
      id: 'tx-001',
      label: 'Initial chips grant',
      amount: config.INITIAL_CHIPS_AMOUNT,
      timestamp: '2026-05-29T14:00:00Z',
      type: 'credit',
      metadata: { source: 'registration' },
    },
    {
      id: 'tx-002',
      label: 'Tournament entry: Friday Freeroll',
      amount: -3000,
      timestamp: '2026-05-29T14:30:00Z',
      type: 'debit',
      metadata: { tournamentId: 'friday-freeroll' },
    },
    {
      id: 'tx-003',
      label: 'Tournament prize: 6th place',
      amount: 8750,
      timestamp: '2026-05-29T15:42:18Z',
      type: 'credit',
      metadata: { tournamentId: 'friday-freeroll', place: 6 },
    },
    {
      id: 'tx-004',
      label: 'Small blind posted',
      amount: -50,
      timestamp: '2026-05-29T16:01:12Z',
      type: 'debit',
      metadata: { tableId: 1, blind: 'small' },
    },
  ],
];

const createSampleLedgerTransactions = (userId) => {
  const templateIndex = (Number(userId) - 1) % ledgerTemplates.length;
  return ledgerTemplates[templateIndex].map((transaction) => ({
    ...transaction,
    id: `u${userId}-${transaction.id}`,
    userId: String(userId),
  }));
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
  playerLedgerTransactions = [
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
      playerLedgerTransactions.push(...createSampleLedgerTransactions(newUser.id));
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
  playerLedger: {
    /**
     * Find read-only player ledger transactions by user ID, newest first
     * @param {string} userId - User ID
     * @returns {Array} User transactions
     */
    findByUserId: (userId) => {
      if (!userId) return [];
      return playerLedgerTransactions
        .filter((transaction) => transaction.userId === String(userId))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(({ userId: _userId, ...transaction }) => transaction);
    },
  },
};

module.exports = mockDataStore;
