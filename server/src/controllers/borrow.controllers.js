const borrowModel = require("../models/borrow.model");

const booksModel = require("../models/books");
const usersModel = require("../models/users");


exports.addBorrowRecord = async (req, res) => {
    const { userId, bookId } = req.body;
    try {
        // console.log(req.body);
        const user = await usersModel.findById({ _id: userId });
        // console.log(user);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const book = await booksModel.findById({ _id: bookId });
        // console.log(book);
        if (!book) return res.status(404).json({ msg: "Book not found" });
        if (book.copies < 1) return res.status(400).json({ msg: "No copies available" });
        const borrowDate = new Date();
        const returnDate = null;
        // Set due date to 14 days from borrow date
        const due_date = new Date(borrowDate);
        due_date.setDate(due_date.getDate() + 14); // Set due date to 14 days from borrow date
        const newBorrow = new borrowModel({ userId, bookId, borrowDate, due_date, returnDate });
        await newBorrow.save();
        book.copies -= 1; // Decrease available copies
        await book.save();
        res.status(201).json(newBorrow);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};
exports.getAllBorrowRecords = async (req, res) => {
    try {
        const borrows = await borrowModel.find();
        // console.log(borrows);
        res.status(200).json(borrows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.getBorrowRecordsByUser = async (req, res) => {
    const userId = req.params.id;
    try {
        // console.log(userId);
        const borrows = await borrowModel.find({ userId });
        res.status(200).json(borrows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

exports.returnBook = async (req, res) => {
    const { borrowId } = req.params;
    try {
        // console.log(borrowId);
        const borrowRecord = await borrowModel.findById(borrowId);
        if (!borrowRecord) return res.status(404).json({ msg: "Borrow record not found" });
        if (borrowRecord.returnDate) return res.status(400).json({ msg: "Book already returned" });
        borrowRecord.returnDate = new Date();
        await borrowRecord.save();

        const book = await booksModel.findById(borrowRecord.bookId);
        book.copies += 1;
        await book.save();

        res.status(200).json(borrowRecord);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};