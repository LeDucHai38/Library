const express = require('express');

const { verifyToken, isAdmin } = require('../middlewares/authmiddlewares');
const booksC = require('../controllers/bookscontrollers');

const router = express.Router();
router.get('/books', booksC.getBooks);
router.get('/books/search/:keyword', booksC.searchBook);
router.post('/books/add', verifyToken, isAdmin, booksC.addBook);
router.put('/books/update/:id', verifyToken, isAdmin, booksC.updateBook);
router.delete('/books/delete/:id', verifyToken, isAdmin, booksC.deleteBook);

module.exports = router;