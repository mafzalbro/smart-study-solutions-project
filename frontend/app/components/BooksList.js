"use client"

import React, { useState, useEffect } from 'react';
import fetchBooksData from '../api/fetchBooksData';
import BookCard from './BookCard';
import Spinner from './Spinner';


export default function BooksList() {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear previous errors

      try {
        const bookData = await fetchBooksData();
        setBooks(bookData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


return (
    <div>
          <h1 className="text-5xl font-bold text-center my-24 text-foreground font-mono">Books List</h1>

      {isLoading ? (
        <Spinner/>
      ) : error ? (
        <p>Error fetching books: {error.message}</p>
      ) : (
        <div className="flex flex-wrap justify-center flex-row gap-5 align-middle my-24">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}
    </div>
  );  
}
