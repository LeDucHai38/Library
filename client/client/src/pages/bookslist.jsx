import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBooks, deleteBook, searchBooks } from "../services/bookservices";
import { addBorrow } from "../services/borrowservices";
import { useEffect } from "react";

function BookList({ token, role }) {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const loadBooks = async () => {
            try {
                const response = await fetchBooks();
                setBooks(response.data);
            } catch (err) {
                setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
            }

        }
        loadBooks();
    }, []);
    const handleDelete = async (id) => {
        if (!confirm("Xóa sách này?")) return;
        try {
            await deleteBook(id);
            setBooks((prev) => prev.filter((b) => b._id !== id));
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    const handleBorrow = async (bookId) => {
        if (!token) return setError("Vui lòng đăng nhập để mượn sách");
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
            await addBorrow({ userId: payload.userId, bookId });
            setBooks((prev) => prev.map((b) => b._id === bookId ? { ...b, copies: b.copies - 1 } : b));
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📚 Danh sách sách</h1>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <input
                        placeholder="Tìm theo tiêu đề/tác giả..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="search-input"
                        style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #d0d5dd" }}
                    />
                    <button
                        className="btn"
                        onClick={async () => {
                            try {
                                if (!keyword.trim()) {
                                    const res = await fetchBooks();
                                    setBooks(res.data);
                                } else {
                                    const res = await searchBooks(keyword.trim());
                                    setBooks(res.data);
                                }
                            } catch (err) {
                                setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
                            }
                        }}
                    >
                        🔎 Tìm
                    </button>
                    {role === "admin" && (
                        <button className="btn primary" onClick={() => navigate("/books/add")}>
                            ➕ Thêm sách mới
                        </button>
                    )}
                </div>
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Tiêu đề</th>
                            <th>Tác giả</th>
                            <th>Năm</th>
                            <th>Bản sao</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map((book) => (
                            <tr key={book._id}>
                                <td>
                                    <div className="book-title">{book.title}</div>
                                </td>
                                <td>{book.author}</td>
                                <td>{book.year}</td>
                                <td>
                                    <span className="copies-info">{book.copies} cuốn</span>
                                </td>
                                <td>
                                    <div className="book-actions">
                                        {role === "admin" ? (
                                            <>
                                                <button className="btn" onClick={() => navigate(`/books/edit/${book._id}`, { state: { book } })}>
                                                    ✏️ Sửa
                                                </button>
                                                <button className="btn danger" onClick={() => handleDelete(book._id)}>
                                                    🗑️ Xóa
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn primary"
                                                disabled={book.copies < 1}
                                                onClick={() => handleBorrow(book._id)}
                                            >
                                                {book.copies < 1 ? "❌ Hết sách" : "📖 Mượn"}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default BookList;
