import { NavLink } from "react-router-dom";

const tabStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #cfd6e4",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "white",
};

export default function Navbar() {
    return (
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <NavLink to="/" style={({ isActive }) => ({ ...tabStyle, borderColor: isActive ? "#4f7cff" : "#cfd6e4" })}>
                📘 Thư viện
            </NavLink>
            <NavLink
                to="/manage"
                style={({ isActive }) => ({ ...tabStyle, borderColor: isActive ? "#2f9e44" : "#cfd6e4" })}
            >
                🛠️ Quản lý sách
            </NavLink>
            <a href="#" onClick={(e) => e.preventDefault()} style={{ ...tabStyle, opacity: 0.55, cursor: "not-allowed" }}>
                📄 Trình đọc PDF
            </a>
        </div>
    );
}
