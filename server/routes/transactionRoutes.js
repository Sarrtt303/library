const express = require('express');
const router = express.Router();
const createTransactionModel = require('../models/Transaction'); // Adjust the path as necessary
const Book = require("../models/Book");
// Create a function that takes the connection as a parameter
const transactionRoutes = (transactionConnection) => {
    // Use the passed connection to create the Transaction model
    const TransactionModel = createTransactionModel(transactionConnection);

    // Get all transactions
    router.get('/', async (req, res) => {
        try {
            const transactions = await TransactionModel.find({});
    
            if (transactions.length === 0) {
                return res.status(404).json({ message: 'No transactions found' });
            }
    
            // Modify response to show the book status based on whether return_date exists
            const formattedTransactions = transactions.map(t => ({
                userId: t.userId,
                bookName: t.bookName,
                issue_date: t.issue_date,
                return_date: t.return_date ? t.return_date : 'Not returned yet',
                rent: t.return_date ? t.rent : 0
            }));
    
            res.status(200).json(formattedTransactions);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    // 1. Issue a Book
    
    const User=require('../models/User')
    router.post('/issue', async (req, res) => {
        const { userId, bookName } = req.body;
    
        if (!userId || !bookName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        try {
            // Check if the user exists
            const user = await User.findOne({ userId: userId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const newTransaction = new TransactionModel({
                userId,
                bookName,
                issue_date: new Date(), // Set the current date and time
                return_date: null,
                rent: 0,
            });
            await newTransaction.save();
            res.status(201).json({ message: 'Book issued successfully', transaction: newTransaction });
        } catch (err) {
            console.error('Error issuing book:', err);
            if (err.name === 'ValidationError') {
                return res.status(400).json({ message: err.message });
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // 2. Return a Book
    router.post('/return', async (req, res) => {
        const { userId, bookName, return_date } = req.body;
    
        if (!userId || !bookName || !return_date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
    
        try {
            const transaction = await TransactionModel.findOne({
                userId,
                bookName,
                return_date: null // Find the transaction that hasn't been returned
            });
    
            if (!transaction) {
                return res.status(404).json({ message: 'No active transaction found for this book and user' });
            }
            // Fetch rentPerDay from the Book collection
            const book = await Book.findOne({ name: bookName });
             if (!book) {
            return res.status(404).json({ message: 'Book not found' });
            }
            const rentPerDay = book.rent_Per_Day; // Get rent per day from the book document
            const issueDate = new Date(transaction.issue_date);
            const returnDate = new Date(); // Set to current date
            const rentDays = Math.ceil((returnDate - issueDate) / (1000 * 60 * 60 * 24)); // Calculate total days
            const totalRent = rentDays * rentPerDay; // Calculate total rent
    
            // Update transaction with return date and rent
            transaction.return_date = return_date;
            transaction.rent = totalRent;
            await transaction.save();
    
            res.status(200).json({ message: 'Book returned successfully', transaction });
        } catch (err) {
            console.error('Error returning book:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // Get a list of people who issued a book in the past and the current person
    router.get('/book-status/:bookName', async (req, res) => {
        const { bookName } = req.params;

        try {
            const pastTransactions = await TransactionModel.find({ bookName });
            const currentlyIssued = await TransactionModel.findOne({ bookName, return_date: null });

            if (pastTransactions.length === 0) {
                return res.status(404).json({ message: 'No transaction records found for this book' });
            }

            const currentStatus = currentlyIssued ? currentlyIssued.userId : 'Not issued at the moment';

            res.status(200).json({
                totalIssued: pastTransactions.length,
                currentlyIssued: currentStatus,
                pastIssuers: pastTransactions.map(t => t.userId),
            });
        } catch (err) {
            console.error('Error fetching book status:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // Get total rent generated by a book
    router.get('/book-rent/:bookName', async (req, res) => {
        const { bookName } = req.params;

        try {
            const transactions = await TransactionModel.find({ bookName, rent: { $exists: true } });
            const totalRent = transactions.reduce((acc, transaction) => acc + transaction.rent, 0);

            res.status(200).json({ bookName, totalRent });
        } catch (err) {
            console.error('Error calculating total rent:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    // Get list of books issued to a person
    router.get('/user-books/:userId', async (req, res) => {
        const { userId } = req.params;

        try {
            const transactions = await TransactionModel.find({ userId });

            if (transactions.length === 0) {
                return res.status(404).json({ message: 'No books found for this user' });
            }

            const booksIssued = transactions.map(t => t.bookName);
            res.status(200).json({ userId, booksIssued });
        } catch (err) {
            console.error('Error fetching user books:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
     // Get list of books issued in a date range
     router.get('/books-issued', async (req, res) => {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Missing date range parameters' });
        }

        try {
            const transactions = await TransactionModel.find({
                issue_date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate),
                },
            });

            if (transactions.length === 0) {
                return res.status(404).json({ message: 'No transactions found in this date range' });
            }

            const issuedBooks = transactions.map(t => ({
                bookName: t.bookName,
                userId: t.userId,
            }));

            res.status(200).json({ issuedBooks });
        } catch (err) {
            console.error('Error fetching books issued in date range:', err);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
    return router; // Return the configured router
};

module.exports = transactionRoutes;
