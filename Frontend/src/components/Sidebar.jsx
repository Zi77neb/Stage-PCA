import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },

    // ADMIN
    { to: "/users", label: "Utilisateurs", adminOnly: true },
    { to: "/banques", label: "Banques", adminOnly: true },
    { to: "/domaines", label: "Domaines", adminOnly: true },
    { to: "/etats", label: "États", adminOnly: true },

    // DOCUMENTS
    
    { to: "/documents-list", label: "Tous les Documents", adminOnly: true },

    // TRACABILITE
    { to: "/traces", label: "Traçabilité", adminOnly: true },

    // USER
    { to: "/my-documents", label: "Mes Documents", userOnly: true }
  ];

  return (
    <div className="sidebar">

      <div className="sidebar-header">
        <div className="sidebar-logo-box">
          <svg className="sidebar-bank-icon" viewBox="0 0 64 64">
            <polygon points="32,6 60,22 4,22" fill="#a8d5a2" />
            <rect x="8" y="22" width="48" height="4" fill="#c8e6c9" />
            <rect x="12" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="22" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="36" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="46" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="6" y="48" width="52" height="5" fill="#c8e6c9" />
            <rect x="2" y="53" width="60" height="4" fill="#a8d5a2" />
          </svg>
        </div>

        <div className="sidebar-header-text">
          <h2 className="sidebar-title">All Doc</h2>
          <span className="sidebar-subtitle">
            {user?.role === "ADMIN" ? "Administration" : "Utilisateur"}
          </span>
        </div>
      </div>

      <div className="sidebar-divider" />

      <nav className="sidebar-nav">
        {navLinks
          .filter(link => {
            if (link.adminOnly && user?.role !== "ADMIN") return false;
            if (link.userOnly && user?.role !== "USER") return false;
            return true;
          })
          .map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
            >
              <span>{link.label}</span>
            </Link>
          ))}
      </nav>

      <div className="sidebar-user">
        <div className="sidebar-user-avatar">
          {user?.username?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">
            {user?.fullName || "Utilisateur"}
          </span>
          <span className="sidebar-user-role">
            {user?.role || "USER"}
          </span>
        </div>
      </div>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Déconnexion
        </button>
      </div>

    </div>
  );
}