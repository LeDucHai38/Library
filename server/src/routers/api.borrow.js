const express = require('express');

const { verifyToken, isAdmin } = require('../middlewares/authmiddlewares');
const borrowC = require('../controllers/borrow.controllers');

const router = express.Router();
router.post('/add', verifyToken, borrowC.addBorrowRecord);
router.get('/all', verifyToken, isAdmin, borrowC.getAllBorrowRecords);
router.get('/my_borrows', verifyToken, borrowC.getBorrowRecordsByUser);
router.put('/return/:borrowId', verifyToken, borrowC.returnBook);


module.exports = router;