const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Function to add or update a review
function addOrUpdateReview(bookId, username, newReview) {
  const book = books[bookId];
  if (!book) {
    return false; // Book not found
  }

  const reviews = book.reviews;

  // Add or update the review
  reviews[username] = newReview; // If the user already has a review, it will update it; otherwise, it adds it

  return true;
}

const authenticatedUser = (username,password)=>{ 
    //Filter the users array for any user with the same username and password
      let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // ISBN from the URL
  const username = req.session.authorization.username; // Username from session
  const review = req.query.review; // Review from query

  if (!review) {
    return res.status(400).json({ message: "Review content missing" });
  }

  // Add or update the review
  const result = addOrUpdateReview(isbn, username, review);
  
  if (result) {
    res.status(200).json({ message: "Comment successfully added", comment: { username, review } });
  } else {
    res.status(500).send({ message: "Something went wrong!" });
  }
});

// Delete a book review by username
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get the ISBN from the URL
  const username = req.session.authorization.username; 
  
  const book = books[isbn]; // Find the book by ISBN
  
  if (!book) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  const reviews = book.reviews;

  // Check if the review by the user exists
  if (reviews[username]) {
    // Delete the review for the user
    delete reviews[username];

    res.status(200).json({ message: `Review by ${username} deleted for book ${book.title}` });
  } else {
    res.status(404).json({ message: `Review by ${username} not found for book ${book.title}` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
