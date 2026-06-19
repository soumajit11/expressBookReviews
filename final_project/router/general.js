const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;

	if (!username || !password) {
		return res.status(404).json({ message: "Unable to register user." });
	}

	if (isValid(username)) {
		return res.status(404).json({ message: "User already exists!" });
	}

	users.push({
		username: username,
		password: password,
	});

	return res.status(200).json({
		message: "User successfully registered. Now you can login",
	});
});

// Get all books
public_users.get("/", async function (req, res) {
	const promise = new Promise((resolve) => {
		resolve(books);
	});

	promise.then((data) => {
		res.status(200).json(data);
	});
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
	const isbn = req.params.isbn;

	const promise = new Promise((resolve) => {
		resolve(books[isbn]);
	});

	promise.then((data) => {
		res.status(200).json(data);
	});
});

// Get book by author
public_users.get("/author/:author", async function (req, res) {
	const author = req.params.author;

	let filteredBooks = Object.entries(books).filter(
		([isbn, book]) => book.author === author,
	);

	return res.status(200).json(filteredBooks);
});

// Get book by title
public_users.get("/title/:title", async function (req, res) {
	const title = req.params.title;

	let filteredBooks = Object.entries(books).filter(
		([isbn, book]) => book.title === title,
	);

	return res.status(200).json(filteredBooks);
});

// Get review
public_users.get("/review/:isbn", function (req, res) {
	const isbn = req.params.isbn;

	return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
