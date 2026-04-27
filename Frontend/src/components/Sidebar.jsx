import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      {/* Logo / Titre */}
      <div className="sidebar-header">
        <div className="sidebar-logo">🌿</div>
        <h2 className="sidebar-title">Admin Panel</h2>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link
          to="/dashboard"
          className={`sidebar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <span className="sidebar-icon">📊</span>
          Dashboard
        </Link>

        <Link
          to="/users"
          className={`sidebar-link ${location.pathname === "/users" ? "active" : ""}`}
        >
          <span className="sidebar-icon">👥</span>
          Users
        </Link>

        <Link
          to="/codes"
          className={`sidebar-link ${location.pathname === "/codes" ? "active" : ""}`}
        >
          <span className="sidebar-icon">🔑</span>
          Codes
        </Link>

        <Link
          to="/domaines"
          className={`sidebar-link ${location.pathname === "/domaines" ? "active" : ""}`}
        >
          <span className="sidebar-icon">🌐</span>
          Domaines
        </Link>

        <Link
          to="/banques"
          className={`sidebar-link ${location.pathname === "/banques" ? "active" : ""}`}
        >
          <span className="sidebar-icon">🏦</span>
          Banques
        </Link>
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          <span className="sidebar-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}