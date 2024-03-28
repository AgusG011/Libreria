import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const [books, setBooks] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
  });
  const [editBook, setEditBook] = useState({
    id: "",
    title: "",
    author: "",
    year: "",
    genre: "",
  });

  const fetchingBooks = () => {
    axios.get("/api").then(function (response) {
      setBooks(response.data.books);
    });
  };

  useEffect(() => {
    fetchingBooks();
  }, []);

  const openAddDialog = () => {
    setIsAddDialogOpen(!isAddDialogOpen);
  };

  const openEditDialog = (book) => {
    setEditBook(book);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api", newBook)
      .then((response) => {
        if (response.status === 201) {
          setIsAddDialogOpen(false);
          setNewBook({
            title: "",
            author: "",
            year: "",
            genre: "",
          });
          fetchingBooks();
          alert("success");
        } else {
          alert("error");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`/api/${editBook._id}`, editBook) // Utilizar el ID del libro para construir la URL
      .then((response) => {
        if (response.status === 200) {
          setIsEditDialogOpen(false);
          fetchingBooks();
          alert("Libro editado exitosamente");
        } else {
          alert("Error al editar el libro");
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Error al editar el libro");
      });
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este libro?")) {
      axios
        .delete(`/api/${id}`)
        .then((response) => {
          if (response.status === 200) {
            // Eliminar el libro del estado después de la eliminación exitosa
            setBooks(books.filter((book) => book.id !== id));
            fetchingBooks();
            alert("Libro eliminado exitosamente");
          } else {
            alert("Error al eliminar el libro");
          }
        })
        .catch((error) => {
          console.log(error);
          alert("Error al eliminar el libro");
        });
    }
  };

  const handleFavorite = (id) => {
    axios
      .put(`/api/fav/${id}`)
      .then((response) => {
        if (response.status === 200) {
          fetchingBooks();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mb-4 flex justify-end">
          <button
            onClick={openAddDialog}
            className="rounded-md bg-gray-700 px-4 py-2 text-white shadow-md hover:bg-gray-600"
          >
            Añadir
          </button>
        </div>
        <div className="rounded-lg bg-gray-100 shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Titulo</th>
                <th className="px-4 py-2">Autor</th>
                <th className="px-4 py-2">Año</th>
                <th className="px-4 py-2">Genero</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id} className="border-b">
                  <td className="px-4 py-2 text-center">{book.title}</td>
                  <td className="px-4 py-2 text-center">{book.author}</td>
                  <td className="px-4 py-2 text-center">{book.year}</td>
                  <td className="px-4 py-2 text-center">{book.genre}</td>
                  <td className="px-4 py-2 text-center flex justify-center items-center">
                    <button
                      className="mr-2 text-gray-700"
                      onClick={() => openEditDialog(book)}
                    >
                      Editar
                    </button>
                    <button
                      className="mr-2 text-gray-700"
                      onClick={() => handleDelete(book._id)}
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleFavorite(book._id)}
                      className="text-gray-700 flex items-center justify-center mt-1"
                    >
                      <FontAwesomeIcon
                        icon={faHeart}
                        className={`h-4 w-4 mr-1 ${
                          book.favorite ? "text-red-500" : "text-slate-600"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-100 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Añadir</h2>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={newBook.title}
                onChange={(e) => {
                  setNewBook((prev) => ({ ...prev, title: e.target.value }));
                }}
                className="w-full rounded-md border p-2"
              />
              <input
                type="text"
                placeholder="Autor"
                value={newBook.author}
                onChange={(e) => {
                  setNewBook((prev) => ({ ...prev, author: e.target.value }));
                }}
                className="w-full rounded-md border p-2"
              />
              <input
                type="number"
                placeholder="Año"
                value={newBook.year}
                onChange={(e) => {
                  setNewBook((prev) => ({ ...prev, year: e.target.value }));
                }}
                className="w-full rounded-md border p-2"
              />
              <input
                type="text"
                placeholder="Género"
                value={newBook.genre}
                onChange={(e) => {
                  setNewBook((prev) => ({ ...prev, genre: e.target.value }));
                }}
                className="w-full rounded-md border p-2"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-gray-700 px-4 py-2 text-white shadow-md hover:bg-gray-600"
                >
                  Añadir
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="ml-2 rounded-md border px-4 py-2 text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-gray-100 p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Editar</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={editBook.title}
                onChange={(e) =>
                  setEditBook({ ...editBook, title: e.target.value })
                }
                className="w-full rounded-md border p-2"
              />
              <input
                type="text"
                placeholder="Autor"
                value={editBook.author}
                onChange={(e) =>
                  setEditBook({ ...editBook, author: e.target.value })
                }
                className="w-full rounded-md border p-2"
              />
              <input
                type="text"
                placeholder="Año"
                value={editBook.year}
                onChange={(e) =>
                  setEditBook({ ...editBook, year: e.target.value })
                }
                className="w-full rounded-md border p-2"
              />
              <input
                type="text"
                placeholder="Género"
                value={editBook.genre}
                onChange={(e) =>
                  setEditBook({ ...editBook, genre: e.target.value })
                }
                className="w-full rounded-md border p-2"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-gray-700 px-4 py-2 text-white shadow-md hover:bg-gray-600"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={closeEditDialog}
                  className="ml-2 rounded-md border px-4 py-2 text-gray-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
