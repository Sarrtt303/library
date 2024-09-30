const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: {type:String,required:true},
    category: {type:String,required:true},
    rent_per_day:{ type: Number, required:true},
    available_copies: { type: Number, default: 1 },

    }, { collection: 'books' });

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
