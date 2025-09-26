import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { fetchBooks, updateBook } from "../services/bookservices";

function EditBook({ token }) {
    const { id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ title: "", author: "", year: "", copies: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                if (state?.book) {
                    const { title, author, year, copies } = state.book;
                    setFormData({ title, author, year: String(year), copies: String(copies) });
                } else {
                    const res = await fetchBooks();
                    const found = res.data.find((b) => b._id === id);
                    if (!found) throw new Error("Không tìm thấy sách");
                    const { title, author, year, copies } = found;
                    setFormData({ title, author, year: String(year), copies: String(copies) });
                }
            } catch (err) {
                setError(err.response?.data?.msg || err.message || "Đã có lỗi xảy ra");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id, state]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, year: Number(formData.year), copies: Number(formData.copies) };
            await updateBook(id, payload);
            navigate("/books");
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    if (!token) {
        return <p>Vui lòng đăng nhập để sửa sách.</p>;
    }

    if (loading) return <p>Đang tải...</p>;

    return (
        <div className="card" style={{ maxWidth: 520, margin: "24px auto" }}>
            <h2>Sửa sách</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <div>
                    <label>Tiêu đề</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Tác giả</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                </div>
                <div>
                    <label>Năm</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} required />
                </div>
                <div>
                    <label>Bản sao</label>
                    <input type="number" name="copies" value={formData.copies} onChange={handleChange} required />
                </div>
                <div className="actions">
                    <button className="btn primary" type="submit">Lưu</button>
                    <button className="btn" type="button" onClick={() => navigate("/books")}>Hủy</button>
                </div>
            </form>
        </div>
    );
}

export default EditBook;


