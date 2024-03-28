const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://machupichu397:CtzEk28Qt0PUwBU5@books.nibowec.mongodb.net/";
const port = 3000;
const app = express();

const { Book } = require("./models/models");

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json({ books });
  } catch (error) {
    console.log("Error en la consulta:", error);
    res.status(500).json({ error: "Error en la consulta" });
  }
});

app.post("/", async (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    const book = new Book({ title, author, year, genre });
    await book.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.log("Error al crear el libro:", error);
    res.status(500).json({ error: "Error al crear el libro" });
  }
});

app.put("/fav/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    console.log(book);
    book.favorite = !book.favorite;
    const updatedBook = await book.save();
    res.status(200).json({ success: true, book: updatedBook });
  } catch (error) {
    console.log(error);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, year, genre },
      { new: true }
    );
    res.status(200).json({ success: true, book: updatedBook });
  } catch (error) {
    console.log("Error al actualizar el libro:", error);
    res.status(500).json({ error: "Error al actualizar el libro" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error al eliminar el libro:", error);
    res.status(500).json({ error: "Error al eliminar el libro" });
  }
});

mongoose.connect(uri).then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
