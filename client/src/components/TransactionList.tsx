// src/components/TransactionList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Transaction {
  _id: string;
  userId: string;
  bookName: string;
  issue_date: Date;
  return_date: Date | null;
  rent: number;
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false); // State to toggle showing all transactions

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://bookmanagementapi-p6dr.onrender.com/api/transactions');
        setTransactions(response.data);
      } catch (err) {
        setError('Error fetching transactions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>{error}</p>;

  // Determine which transactions to display
  const displayedTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Transaction List</h2>
      <ul>
        {displayedTransactions.map((transaction) => (
          <li key={transaction._id} className="border p-4 mb-2 rounded shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold">Book: {transaction.bookName}</h3>
            <p>Issued to: {transaction.userId}</p>
            <p>Issue Date: {new Date(transaction.issue_date).toLocaleDateString()}</p>
            <p>Return Date: {transaction.return_date ? new Date(transaction.return_date).toLocaleDateString() : 'Not Returned'}</p>
            <p>Rent: ${transaction.rent}</p>
          </li>
        ))}
      </ul>

      {/* Button to toggle showing all transactions */}
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-4 bg-gray-800 text-white font-semibold py-2 px-4 rounded shadow hover:bg-gray-600 transition"
      >
        {showAll ? 'Show Less' : 'Show All'}
      </button>
    </div>
  );
};

export default TransactionList;
