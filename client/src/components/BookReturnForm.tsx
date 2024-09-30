import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookReturnForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [bookName, setBookName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rent, setRent] = useState<number | null>(null);
  const [returnDate, setReturnDate] = useState<string>('');

  // Set the current date and time as returnDate when the component mounts
  useEffect(() => {
    const today = new Date();
    const isoString = today.toISOString(); // Full ISO format: YYYY-MM-DDTHH:mm:ss.sssZ
    setReturnDate(isoString); // Use the full ISO string for the return date
  }, []);

  // Return Book
  const returnBook = async () => {
    try {
      setLoading(true);
      const response = await axios.post('https://bookmanagementapi-p6dr.onrender.com/api/transactions/return', {
        userId,
        bookName,
        return_date: returnDate, // Send the current date in ISO format as return_date
      });

      // Check if the response contains the rent and message
      const { message, transaction } = response.data;
      setMessage(message);

      // Display the rent if it exists
      if (transaction && transaction.rent) {
        setRent(transaction.rent);
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.message || 'Error returning the book');
      } else {
        setMessage('Error returning the book');
      }
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

      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-1">Return Date:</label>
        <input
          type="text" // Change to text to show the ISO format
          value={returnDate}
          readOnly // Make the input read-only
          className="border border-gray-300 rounded p-2 w-full"
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
      {rent !== null && <p className="mt-2 text-blue-500">Total Rent: ${rent.toFixed(2)}</p>}
    </div>
  );
};

export default BookReturnForm;
