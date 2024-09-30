const express = require('express');
const Book = require('../models/Book');
const router = express.Router();

// Get all books or filter by query parameters
router.get('/', async (req, res) => {
    try {
        // Extract query parameters for filtering
        const { term, minRent, maxRent, category, minCopies } = req.query;

        // Create a filter object to build the query dynamically
        const filter = {};

        // If a term is provided, use it to search for books with names containing the term
        if (term) {
            filter.name = { $regex: term, $options: 'i' }; // Case-insensitive regex search for the term
        }

        // If minRent or maxRent are provided, filter books within the rent per day range
        if (minRent || maxRent) {
            filter.rent_per_day = {};
            if (minRent) filter.rent_per_day.$gte = Number(minRent); // Greater than or equal to minRent
            if (maxRent) filter.rent_per_day.$lte = Number(maxRent); // Less than or equal to maxRent
        }

        // If a category is provided, filter books by that category
        if (category) {
            filter.category = category;
        }

        // If minCopies is provided, filter books with available copies greater than or equal to minCopies
        if (minCopies) {
            filter.available_copies = { $gte: Number(minCopies) };
        }

        // Log the constructed filter for debugging purposes
        console.log('Filter being applied:', filter);

        // Fetch books based on the dynamic filter
        const books = await Book.find(filter);

        // If no books are found, return a 404 response
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the criteria' });
        }

        // Return the filtered or full list of books
        res.status(200).json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
