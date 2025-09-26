import { Link, useNavigate } from "react-router-dom";

function Navbar({ token, role, setToken, setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
    navigate("/auth/login");
  };

  return (
    <header className="navbar">
      <div className="container">
        <div className="brand"><Link to="/">Library</Link></div>
        <nav className="links">
          <Link to="/books">Sách</Link>
          {token && role !== "admin" && (
            <Link to="/my-borrows">Mượn của tôi</Link>
          )}
          {role === "admin" && token && (
            <Link to="/borrows">Quản trị mượn</Link>
          )}
        </nav>
        <div className="auth">
          {!token ? (
            <>
              <Link className="btn" to="/auth/register">Đăng ký</Link>
              <Link className="btn primary" to="/auth/login">Đăng nhập</Link>
            </>
          ) : (
            <button className="btn danger" onClick={handleLogout}>Đăng xuất</button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
