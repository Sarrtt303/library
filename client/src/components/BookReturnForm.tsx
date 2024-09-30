import React, { useState } from 'react';
import axios from 'axios';

const BookReturnForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [bookName, setBookName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rent, setRent] = useState(0);

  // Return Book
  const returnBook = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/transactions/return', {
        userId,
        bookName,
        return_date: new Date().toISOString(), // Set current date as return date
      });
      setMessage(response.data.message);
      setRent(response.data.transaction.rent);
    } catch (error) {
      setMessage('Error returning the book');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Return Book</h2>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">User ID:</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="Enter User ID"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Book Name:</label>
        <input
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="Enter Book Name"
        />
      </div>

      <button
        onClick={returnBook}
        disabled={loading}
        className="bg-green-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-600 transition"
      >
        {loading ? 'Returning...' : 'Return Book'}
      </button>

      {message && <p className="mt-4 text-red-500">{message}</p>}
      {rent > 0 && <p className="mt-2 text-blue-500">Total Rent: ${rent}</p>}
    </div>
  );
};

export default BookReturnForm;
