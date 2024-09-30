import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  _id: string;
  name: string;
  category: string;
  rent_per_day: number;
  available_copies: number;
}

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [term, setTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(5); // Show 5 books initially

  const handleFilterChange = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the form from reloading the page
    setLoading(true); // Start loading

    try {
      const response = await axios.get('https://bookmanagementapi-p6dr.onrender.com/api/books', {
        params: {
          term,  // Only filter by the search term
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch initial book list when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://bookmanagementapi-p6dr.onrender.com/api/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const loadMoreBooks = () => {
    setDisplayCount(displayCount + 5);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Books</h2>
      <form onSubmit={handleFilterChange} className="mb-4">
        <input
          type="text"
          placeholder="Search by term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-gray-800 text-white p-2">
          Search
        </button>
      </form>
      <ul>
        {books.slice(0, displayCount).map(book => (
          <li key={book._id} className="border p-4 mb-2 rounded shadow hover:shadow-md transition">
            <h3 className="text-lg font-semibold">{book.name}</h3>
            <p className="text-gray-600">Category: {book.category}</p>
            <p className="text-gray-600">Rent per day: ${book.rent_per_day}</p>
            <p className="text-gray-600">Available copies: {book.available_copies}</p>
          </li>
        ))}
      </ul>
      {displayCount < books.length && (
        <button onClick={loadMoreBooks} className="mt-4 bg-gray-800 text-white p-2">
          Show More
        </button>
      )}
    </div>
  );
};

export default BookList;
