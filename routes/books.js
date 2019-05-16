const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

const Book = require('../models').Book;

// Render books listing
router.get('/books', (req, res) => {
    Book.findAll()
    .then(books => {
        res.render('index', { books })
    })
    .catch(err => res.render("error", { err }));
});

// Render New Books Route
router.get('/books/new', (req, res) => {
    res.render('new-book', {
        book: Book.build(), 
        title: 'New Book'
    });
});

// POST new book to db
router.post('/books/new', (req, res, next) => {
    Book.create(req.body)
    .then(book => {
        console.log(book)
        res.redirect(`/books/${book.id}`)
    })
    .catch(err => {
        if(err.name === "SequelizeValidationError") {
            res.render('books/new-book', {
                book: Book.build(req.body), 
                errors: err.errors
            });
        } else {
            throw err;
        }
    })
    .catch(err => {
        res.send(500);
    });
});

// Book Detail Page
router.get('/books/:id', (req, res, next) => {
    Book.findByPk(req.params.id)
    .then(book => {
        res.render('books/:id', { book });
    })
    .catch(err => {
        res.render('error', { err });
    });
});

// Update books
router.get('/:id', (req, res, next) => {
    Book.findByPk(req.params.id).then(book => {
        console.log(book);
    })
});

// Delete book
router.get('/:id/delete', (req, res, next) => {
    Book.findByPk(req.params.id)
    .then((book) => {
        res.render('books/delete', { article })
    })
})

// Delete individual book
router.delete("/books/:id/delete", (req, res) => {
    Book.findByPk(req.params.id)
      .then(book => book.destroy())
      .then(() => res.redirect("/books"))
      .catch(err => res.render("error", { err }));
  });

module.exports = router;