import { useEffect, useState } from "react";
import { listAllBorrows, returnBook } from "../services/borrowservices";

function BorrowList({ role, token }) {
    const [records, setRecords] = useState([]);
    const [error, setError] = useState("");
    useEffect(() => {
        const load = async () => {
            try {
                const res = await listAllBorrows();
                setRecords(res.data);
            } catch (err) {
                setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
            }
        };
        load();
    }, []);

    if (!token || role !== "admin") return <p>Chỉ admin mới truy cập danh sách mượn.</p>;

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📋 Quản lý mượn sách</h1>
            </div>
            {error && <div className="error-message">{error}</div>}

            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Người mượn</th>
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
                                <td>
                                    <div style={{ color: "#6b7280", fontSize: 12 }}>
                                        ID: {typeof r.userId === 'string' ? r.userId : (r.userId?._id || r.userId || "-")}
                                    </div>
                                </td>
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
                                        <button
                                            className="btn primary"
                                            onClick={async () => {
                                                try {
                                                    await returnBook(r._id);
                                                    setRecords((prev) => prev.map((x) => x._id === r._id ? { ...x, returnDate: new Date().toISOString() } : x));
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

export default BorrowList;


