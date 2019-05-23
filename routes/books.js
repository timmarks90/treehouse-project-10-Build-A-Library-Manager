const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

const Book = require('../models').Book;

// Limit results
let limit = 10;
let offset = 0;
let numberOfBooks = 0;
let pageButtons = [];

// Render books listing
router.get('/books', (req, res) => {
    // Count books for pagination
    Book.count()
    .then(library => {
        numberOfBooks = library;
        if (pageButtons = []) {
            // Set up page buttons for books
            const pages = Math.ceil(numberOfBooks / limit) + 1;
            for (let i = 1; i < pages; i++) {
                pageButtons.push(i);
            }
        }
        // Link offset values to pages
        if (req.query.offset !== undefined) {
                req.query.offset;
            if (req.query.offset < 1) {
                res.redirect("/books?offset=1");
            } else if (req.query.offset > Math.ceil(numberOfBooks / limit) + 1) { // display page number in url param
                res.redirect(`/books?offset=${pages - 1}`);
            } else {
                // Set the range of books to display per page
                offset = (parseInt(req.query.offset) * 10) - 10;
            }
          }
    })
    .then(() => {
        // Find books in database
        Book.findAll({
            limit: limit,
            offset: offset,
            order: [['createdAt', 'DESC']]
        })
        .then(books => {
            res.render('index', { books, pageButtons, numberOfBooks }) // Render books and buttons to pug pages
        })
        .catch(err => res.render("error", { err }));
    });
});

// Search books route
router.get('/books/search', (req, res) => {
    res.redirect('/');
});
// Update book listing off search results
router.post('/books/search', (req, res) => {
    const Op = sequelize.Op;
    const searchText = req.body;
    // Refresh page if empty search
    if(searchText.search === '') {
        res.redirect('/');
    }
    else {
        // Search case insensitive and be good for partial matches for strings.
        const searchResults = {
            where: {
                [Op.or]: [
                    {
                        title: {[Op.like]: `%${searchText.search}%`}
                    },
                    {
                        author: {[Op.like]: `%${searchText.search}%`}
                    },
                    {
                        genre: {[Op.like]: `%${searchText.search}%`}
                    },
                    {
                        year: {[Op.like]: `%${searchText.search}%`}
                    }
                ]
            }
        }
        Book.findAll(searchResults)
        .then(books => {
            res.render('index', { books, pageButtons: [], numberOfBooks }) // Render books and buttons to pug pages
        })
        .catch(err => res.render("error", { err }));   
    }
})

// Render New Books Route
router.get('/books/new', (req, res) => {
    res.render('new-book', {
        book: Book.build()
    });
});

// POST new book to db
router.post('/books/new', (req, res, next) => {
    Book.create(req.body)
    .then(book => {
        res.redirect(`/`)
    })
    .catch(err => {
        if(err.name === "SequelizeValidationError") {
            res.render('new-book', {
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
        if(book) {
            res.render('update-book', { book });
        } else {
            res.render('page-not-found');
        }
    })
    .catch(err => {
        res.render('error', { err });
    });
});

// Update books
router.post('/books/:id', (req, res, next) => {
    Book.findByPk(req.params.id)
    .then(book => {
        return book.update(req.body);
    })
    .then(book => {
        res.redirect(`/`);
    })
    .catch(err => {
        if(err.name === "SequelizeValidationError") {
            const book = Book.build(req.body);
            book.id = req.params.id;
            
            res.render('update-book', {
                book: book,
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

// Delete individual book Route
router.get('/books/:id/delete', (req, res, next) => {
    Book.findByPk(req.params.id)
      .then(book => {
          res.render(`/books/${book.id}/delete`, { book })
      })
});

// Delete individual book
router.post('/books/:id/delete', (req, res, next) => {
    Book.findByPk(req.params.id)
    .then(book => {
        book.destroy()
      })
    .then(() => {
        res.redirect('/')
    })
});

module.exports = router;