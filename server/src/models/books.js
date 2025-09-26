const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    authors: {
        type: [Array],
        required: true
    },
    year: {
        type: String,
        required: true
    },
    copies: {
        type: String,
        required: true
    },
    tags: {
        type: [Array],
        required: true
    }
});
module.exports = mongoose.model("Book", booksSchema);