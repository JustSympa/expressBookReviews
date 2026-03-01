const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  }).then((books) => {
    return res.status(200).json(books);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching books"});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  }).then((book) => {
    return res.status(200).json(book);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found by this author");
    }
  }).then((books) => {
    return res.status(200).json(books);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  }).then((books) => {
    return res.status(200).json(books);
  }).catch((error) => {
    return res.status(404).json({message: error});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).json(books[req.params.isbn]?.reviews || []);
});

module.exports.general = public_users;
