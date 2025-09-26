import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addBook } from "../services/bookservices";

function AddBook({ token }) {
    const [formData, setFormData] = useState({ title: "", author: "", year: "", copies: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, year: Number(formData.year), copies: Number(formData.copies) };
            await addBook(payload);
            navigate("/books");
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    if (!token) {
        return <p>Vui lòng đăng nhập để thêm sách.</p>;
    }

    return (
        <div className="card" style={{ maxWidth: 520, margin: "24px auto" }}>
            <h2>Thêm sách mới</h2>
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

export default AddBook;


