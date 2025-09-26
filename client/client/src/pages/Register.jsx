import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authservices";

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate("/auth/login");
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    return (
        <div className="card" style={{ maxWidth: 480, margin: "24px auto" }}>
            <h2>Đăng ký</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <div>
                    <label>Tên</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="actions">
                    <button className="btn primary" type="submit">Đăng ký</button>
                </div>
            </form>
        </div>
    );
}
export default Register;
