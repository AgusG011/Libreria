const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: String,
  author: String,
  year: Number,
  genre: String,
  favorite: { type: Boolean, default: false },
});

module.exports = { bookSchema };
