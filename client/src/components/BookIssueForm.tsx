import React, { useState } from 'react';
import axios from 'axios';

const BookIssueForm: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [bookName, setBookName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const issueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!userId || !bookName) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('https://bookmanagementapi-p6dr.onrender.com/api/transactions/issue', {
        userId,
        bookName,
        // The server will set the issue_date
      });
      setMessage(response.data.message);
      // Clear form fields on success
      setUserId('');
      setBookName('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.message || 'Error issuing the book');
      } else {
        setError('Error issuing the book');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={issueBook} className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Issue Book</h2>

      <div className="mb-4">
        <label htmlFor="userId" className="block text-gray-700 font-semibold mb-1">User ID:</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="Enter User ID"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="bookName" className="block text-gray-700 font-semibold mb-1">Book Name:</label>
        <input
          id="bookName"
          type="text"
          value={bookName}
          onChange={(e) => setBookName(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
          placeholder="Enter Book Name"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? 'Issuing...' : 'Issue Book'}
      </button>

      {message && <p className="mt-4 text-green-500">{message}</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </form>
  );
};

export default BookIssueForm;