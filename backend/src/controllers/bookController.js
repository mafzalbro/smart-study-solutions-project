const Book = require('../models/book');
const { recommendBooks } = require('../services/bookRecommendation');
const { getNextSequenceValue } = require("../utils/autoIncrement");
const { paginateResults } = require('../utils/pagination');

// Recommend books to the authenticated user
const recommendBook = async (req, res) => {
  try {
    const user = req.user;
    const recommendedBooks = await recommendBooks(user);
    res.status(200).json(recommendedBooks);
  } catch (error) {
    console.error('Error recommending books:', error);
    res.status(500).json({ message: 'Error recommending books' });
  }
};

// Get a book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching book by ID' });
  }
};

// Add a new book
const addBook = async (req, res) => {
  const { title, author, genre, description, status, slug, type, ai_approval, tags } = req.body;
  try {
    const existingBook = await Book.findOne({ slug });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with the same slug already exists' });
    }

    const serialNumber = await getNextSequenceValue('bookSerial', "Books");
    const newBook = new Book({
      serialNumber,
      title,
      author,
      description,
      genre,
      status,
      slug,
      type,
      ai_approval,
      tags
    });
    await newBook.save();
    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding book' });
  }
};

// Update a book
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, description, status, slug, type, ai_approval, tags } = req.body;
  try {
    const existingBook = await Book.findOne({ title, _id: { $ne: id } });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with the updated title already exists' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, {
      title,
      author,
      description,
      genre,
      status,
      slug,
      type,
      ai_approval,
      tags
    }, { new: true });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating book' });
  }
};

// Delete a book by ID
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting book' });
  }
};

// Get all books with optional sorting, filtering, and searching
const getAllBooks = async (req, res) => {
  const { page = 1, limit = 5, sortBy, filterBy, query } = req.query;
  let queryOptions = {};
  let sortOptions = {}
  try {
    if (sortBy) {
      const [field, direction] = sortBy.split(':')
      sortOptions[field] = direction == "desc" ? "desc" : "asc";
    }

    if (filterBy) {
      const filter = JSON.parse(filterBy);
      Object.assign(queryOptions, filter);
    }

    if (query) {
      queryOptions.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    const results = await paginateResults(Book.find(queryOptions).sort(sortOptions), parseInt(page), parseInt(limit));
    res.status(200).json({results, sortOptions, queryOptions});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// Sort all books with optional pagination
const sortAllBooks = async (req, res) => {
  const { page = 1, limit = 5, sortBy } = req.query;
  if (!sortBy) {
    return res.status(400).json({ message: 'Sort query is required' });
  }
  try {
    const results = await paginateResults(Book.find().sort(sortBy), parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sorting books' });
  }
};

// Filter all books with optional pagination
const filterAllBooks = async (req, res) => {
  const { page = 1, limit = 5, filterBy } = req.query;
  try {
    const filter = JSON.parse(filterBy);
    const results = await paginateResults(Book.find(filter), parseInt(page), parseInt(limit));
    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error filtering books' });
  }
};

// Search books with optional pagination
const searchAllBooks = async (req, res) => {
  const { page = 1, limit = 5, query } = req.query;
  try {
    const searchResults = await paginateResults(Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { genre: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }), parseInt(page), parseInt(limit));
    res.status(200).json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching books' });
  }
};

module.exports = {
  recommendBook,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  sortAllBooks,
  filterAllBooks,
  searchAllBooks
};
