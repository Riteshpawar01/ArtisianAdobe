const mongoose = require('mongoose');

/**
 * High-order helper to execute business logic within a MongoDB ACID Transaction.
 * Abstracts away session management, commit, abort, and session cleanup.
 * 
 * @param {Function} callback - Async function executing DB ops. Receives the `session` object.
 * @returns {Promise<any>} - Returns the resolved value of the callback.
 */
const runInTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  runInTransaction
};
