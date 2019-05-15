const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Render books listing
router.get('/books', (req, res, next) => {
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
    .then(() => res.redirect('/' + Book.id))
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
router.get('/book/:id', (req, res, next) => {
    Book.findByPk(req.params.id)
    .then(book => {
        res.render('books/:id', { book });
    })
    .catch(err => {
        res.render('error', { err });
    });
});

// Get Books
router.get('/:id', (req, res, next) => {
    Book.findByPk(req.params.id).then(book => {
        res.render('new-book', {
            book: book
        });
    })
});

module.exports = router;