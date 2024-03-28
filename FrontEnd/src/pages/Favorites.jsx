import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Favorites() {
  const [books, setBooks] = useState([]);

  const fetchingBooks = () => {
    axios.get("/api").then(function (response) {
      setBooks(response.data.books);
    });
  };

  useEffect(() => {
    fetchingBooks();
  }, []);

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

  const navigate = useNavigate();

  const location = useLocation();

  const redirectToHome = () => {
    navigate("/");
  };

  const redirectToFavorites = () => {
    navigate("/favorites");
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="flex justify-start">
          <div className=" mb-4 flex overflow-x-auto overflow-y-hidden border-b border-gray-200 whitespace-nowrap dark:border-gray-700">
            <button
              onClick={redirectToHome}
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center ${
                location.pathname === "/"
                  ? "text-blue-600 bg-blue-100 border-b-2 border-blue-500"
                  : "text-gray-700 bg-transparent border-b-2 border-transparent"
              } sm:text-base  whitespace-nowrap focus:outline-none`}
            >
              Inicio
            </button>
            <button
              onClick={redirectToFavorites}
              className={`inline-flex items-center h-10 px-4 -mb-px text-sm text-center ${
                location.pathname === "/favorites"
                  ? "text-blue-600 bg-blue-100 border-b-2 border-blue-500"
                  : "text-gray-700 bg-transparent border-b-2 border-transparent"
              } sm:text-base  whitespace-nowrap focus:outline-none`}
            >
              Favoritos
            </button>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="rounded-lg bg-gray-100 shadow-md"
          >
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
                {books
                  .filter((filterBook) => {
                    return filterBook.favorite; // Devuelve true o false
                  })
                  .map((book) => (
                    <tr key={book._id} className="border-b">
                      <td className="px-4 py-2 text-center">{book.title}</td>
                      <td className="px-4 py-2 text-center">{book.author}</td>
                      <td className="px-4 py-2 text-center">{book.year}</td>
                      <td className="px-4 py-2 text-center">{book.genre}</td>
                      <td className="px-4 py-2 text-center flex justify-center items-center">
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
