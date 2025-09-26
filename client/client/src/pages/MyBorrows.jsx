import { useEffect, useState } from "react";
import { listUserBorrows, returnBook } from "../services/borrowservices";

function MyBorrows({ token }) {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");

    useEffect(() => {
        // Decode token to get userId; token payload is { userId, role }
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));
            setUserId(payload.userId);
        } catch (_) { }
    }, [token]);

    useEffect(() => {
        if (!userId) return;
        const load = async () => {
            try {
                const res = await listUserBorrows(userId);
                setRecords(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
            }
        };
        load();
    }, [userId]);

    const onReturn = async (borrowId) => {
        try {
            await returnBook(borrowId);
            setRecords((prev) => prev.map((r) => r._id === borrowId ? { ...r, returnDate: new Date().toISOString() } : r));
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    if (!token) return <p>Vui lòng đăng nhập để xem lịch sử mượn.</p>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📖 Sách đã mượn</h1>
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Book ID</th>
                            <th>Ngày mượn</th>
                            <th>Hạn trả</th>
                            <th>Trạng thái</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((r) => (
                            <tr key={r._id}>
                                <td>{r.bookId}</td>
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
                                        <button className="btn primary" onClick={() => onReturn(r._id)}>
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


