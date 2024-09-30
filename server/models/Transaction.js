const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    userId: String,
    bookName: String,
    issue_date: { type: Date, default: Date.now },
    return_date: { type: Date, default: null },
    rent: { type: Number, default: 0 }
}, { collection: 'transactions' });

// Create a function that returns the Transaction model
const createTransactionModel = (connection) => {
    return connection.model('Transaction', TransactionSchema);
};

module.exports = createTransactionModel;
