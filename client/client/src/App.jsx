import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import BookList from "./pages/bookslist";
import AddBook from "./pages/AddBook";
import EditBook from "./pages/EditBook";
import BorrowList from "./pages/BorrowList";
import MyBorrows from "./pages/MyBorrows";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  return (
    <Router>
      <Navbar token={token} role={role} setToken={setToken} setRole={setRole} />
      <Routes>
        <Route path="/" element={<Home token={token} role={role} />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login setToken={setToken} setRole={setRole} />} />
        <Route path="/books" element={<BookList token={token} role={role} />} />
        <Route path="/books/add" element={<AddBook token={token} />} />
        <Route path="/books/edit/:id" element={<EditBook token={token} />} />
        <Route path="/borrows" element={<BorrowList role={role} token={token} />} />
        <Route path="/my-borrows" element={<MyBorrows token={token} />} />
      </Routes>
    </Router>
  );
}

export default App;
