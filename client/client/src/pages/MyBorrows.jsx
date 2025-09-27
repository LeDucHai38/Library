// src/pages/MyBorrows.jsx
import { useEffect, useState } from "react";
import { getMyBorrows, returnBook } from "../services/borrowservices";

function MyBorrows({ token }) {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getMyBorrows(); // 🔥 chỉ gọi API /my_borrows
                setRecords(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
            }
        };
        if (token) load();
    }, [token]);

    if (!token) return <p>Vui lòng đăng nhập để xem danh sách mượn.</p>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📚 Danh sách sách tôi đã mượn</h1>
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sách</th>
                            <th>Ngày mượn</th>
                            <th>Hạn trả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r._id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>
                                        {r.bookId?.title || r.bookId || "Không rõ tên sách"}
                                    </div>
                                    <div style={{ color: "#6b7280", fontSize: 12 }}>
                                        ID: {typeof r.bookId === "string" ? r.bookId : (r.bookId?._id || "-")}
                                    </div>
                                </td>
                                <td>{new Date(r.borrowDate).toLocaleDateString()}</td>
                                <td>{new Date(r.due_date).toLocaleDateString()}</td>
                                <td>
                                    {r.returnDate ? (
                                        <span className="status-badge returned">✅ Đã trả</span>
                                    ) : (
                                        <span className="status-badge borrowed">📖 Đang mượn</span>
                                    )}
                                </td>
                                <td>
                                    {r.returnDate ? (
                                        <span style={{ color: "#16a34a", fontSize: "12px" }}>
                                            Trả lúc: {new Date(r.returnDate).toLocaleString()}
                                        </span>
                                    ) : (
                                        <button
                                            className="btn primary"
                                            onClick={async () => {
                                                try {
                                                    await returnBook(r._id);
                                                    setRecords((prev) =>
                                                        prev.map((x) =>
                                                            x._id === r._id ? { ...x, returnDate: new Date().toISOString() } : x
                                                        )
                                                    );
                                                } catch (err) {
                                                    setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
                                                }
                                            }}
                                        >
                                            🔄 Trả sách
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MyBorrows;
