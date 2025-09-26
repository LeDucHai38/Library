import API from "./api";

export const fetchBooks = () => API.get("/books");
export const addBook = (formData) => API.post("/books/add", formData);
export const updateBook = (id, formData) => API.put(`/books/update/${id}`, formData);
export const deleteBook = (id) => API.delete(`/books/delete/${id}`);
export const searchBooks = (keyword) => API.get(`/books/search/${encodeURIComponent(keyword)}`);

