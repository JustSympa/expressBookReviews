const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, "access", { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken: token };
    return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  if (books[isbn]) {
    const username = req.user.username;
    books[isbn].reviews[username] = review;
    return res.status(200).json({message: "Review added/updated successfully"});
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const username = req.user.username;
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({message: "Review deleted successfully"});
    } else {
      return res.status(404).json({message: "Review not found for this user"});
    }
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
