import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui, Arial", background: "#f6f7fb", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 16px" }}>
        <h1 style={{ textAlign: "center", margin: "0 0 18px" }}>📚 Ứng dụng Quản lý Sách</h1>
        <Navbar />
        <div style={{ marginTop: 18 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
