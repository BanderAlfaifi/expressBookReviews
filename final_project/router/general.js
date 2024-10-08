const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// A function for searching the books based on the kay and value
function searchBooks(key, value) {
  let results = [];
  
  for (let i in books) {
    if (books[i][key] && books[i][key].toLowerCase() === value.toLowerCase()) {
      results.push(books[i]);
    }
  }
  
  return results;
}

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json(books)
});


// using async/await
/*
public_users.get('/', async function (req, res) {
  try {
    const booksAsync = await books;
    res.status(200).json(booksAsync)
  } catch (error) {
    res.status(500).json({message: error.message})
  } 
});
*/

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  res.status(200).json(book)
 });

 // using async/await
 /*
 public_users.get('/isbn/:isbn', async function (req, res) {
  try {
     const isbn = req.params.isbn
     const book = await books[isbn]
     res.status(200).json(book)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
 });
 */
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  const book = searchBooks("author", author);
  res.status(200).json(book)
});

// using async/await
/*
public_users.get('/author/:author',async function (req, res) {
  try {
    const author = req.params.author
    const book = await searchBooks("author", author);
    res.status(200).json(book)
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});
*/

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  const book = searchBooks("title", title);
  res.status(200).json(book)
});

// using async/await
/*
public_users.get('/title/:title',async function (req, res) {
  try {
    const title = req.params.title
    const book = await searchBooks("title", title);
    res.status(200).json(book)   
  } catch (error) {
    res.status(500).json({message: error.message})
  }
});
*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]["reviews"]
  res.status(200).json(book)
});

module.exports.general = public_users;
