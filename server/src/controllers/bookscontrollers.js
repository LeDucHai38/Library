const books = require("../models/books");

// Add a new book
exports.addBook = async (req, res) => {
    const { title, authors, year, copies, tags } = req.body;

    try {
        console.log(req.body);
        const newBook = new books({ title, authors, year, copies, tags });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Get all books
exports.getBooks = async (req, res) => {
    try {
        const allBooks = await books.find();
        res.json(allBooks);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }

};

exports.searchBook = async (req, res) => {
    const keyword = decodeURIComponent(req.params.keyword).trim();
    try {
        const booksResult = await books.find({
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { authors: { $regex: keyword, $options: "i" } }
            ]
        });

        if (!booksResult || booksResult.length === 0) {
            return res.status(404).json({ msg: "Book not found" });
        }

        res.json(booksResult);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Update a book
exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, authors, year, copies, tags } = req.body;
    try {
        const updatedBook = await books.findByIdAndUpdate(
            id,
            { title, authors, year, copies, tags },
            { new: true }
        );
        if (!updatedBook) return res.status(404).json({ msg: "Book not found" });
        res.json(updatedBook);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Delete
exports.deleteBook = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedBook = await books.findByIdAndDelete(id);
        if (!deletedBook) return res.status(404).json({ msg: "Book not found" });
        res.json({ msg: "Book deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

