import API from "./api";

export const addBorrow = ({ userId, bookId }) => API.post("/borrow/add", { userId, bookId });
export const listAllBorrows = () => API.get("/borrow/all");
export const listUserBorrows = (userId) => API.get(`/borrow/get_by_id/${userId}`);
export const returnBook = (borrowId) => API.put(`/borrow/return/${borrowId}`);


