import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authservices";

function Login({ setToken, setRole }) {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            setToken(res.data.token);
            setRole(res.data.role);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.msg || "Đã có lỗi xảy ra");
        }
    };

    return (
        <div className="card" style={{ maxWidth: 420, margin: "24px auto" }}>
            <h2>Đăng nhập</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form className="form" onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Mật khẩu</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="actions">
                    <button className="btn primary" type="submit">Đăng nhập</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
