const express = require('express');
const router = express.Router();
const sequelize = require('sequelize');

const Book = require('../models').Book;

// Render books listing
router.get('/books', (req, res) => {
    Book.findAll({
        order: [['createdAt', 'DESC']]
    })
    .then(books => {
        res.render('index', { books })
    })
    .catch(err => res.render("error", { err }));
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
                        title: {
                        [Op.like]: `%${searchText.search}%`
                        }
                    },
                    {
                        author: {
                        [Op.like]: `%${searchText.search}%`
                        }
                    },
                    {
                        genre: {
                            [Op.like]: `%${searchText.search}%`
                        }
                    },
                    {
                        year: {
                            [Op.like]: `%${searchText.search}%`
                        }
                    }
                ]
            }
        }
        Book.findAll(searchResults)
        .then(books => {
            res.render('index', { books })
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
        res.render('update-book', { book });
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