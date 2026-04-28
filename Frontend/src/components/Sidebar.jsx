import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  const navLinks = [
    { to: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { to: "/users",     icon: "users",     label: "Utilisateurs" },
    { to: "/codes",     icon: "codes",     label: "Codes" },
    { to: "/domaines",  icon: "domaines",  label: "Domaines" },
    { to: "/banques",   icon: "banques",   label: "Banques" },
  ];

  return (
    <div className="sidebar">

      {/* ===== LOGO BANQUE ===== */}
      <div className="sidebar-header">
        <div className="sidebar-logo-box">
          {/* SVG Logo Banque */}
          <svg
            className="sidebar-bank-icon"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Toit */}
            <polygon points="32,6 60,22 4,22" fill="#a8d5a2" />
            {/* Corps */}
            <rect x="8" y="22" width="48" height="4" fill="#c8e6c9" />
            {/* Colonnes */}
            <rect x="12" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="22" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="36" y="26" width="6" height="22" fill="#f5f0e8" />
            <rect x="46" y="26" width="6" height="22" fill="#f5f0e8" />
            {/* Base */}
            <rect x="6" y="48" width="52" height="5" fill="#c8e6c9" />
            {/* Sol */}
            <rect x="2" y="53" width="60" height="4" fill="#a8d5a2" />
          </svg>
        </div>
        <div className="sidebar-header-text">
          <h2 className="sidebar-title">All Doc</h2>
          <span className="sidebar-subtitle">Administration</span>
        </div>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="sidebar-divider" />

      {/* ===== NAV ===== */}
      <nav className="sidebar-nav">

        <Link
          to="/dashboard"
          className={`sidebar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <span className="sidebar-icon">
            {/* Chart icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="12" width="4" height="9"/>
              <rect x="10" y="7" width="4" height="14"/>
              <rect x="17" y="3" width="4" height="18"/>
            </svg>
          </span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/users"
          className={`sidebar-link ${location.pathname === "/users" ? "active" : ""}`}
        >
          <span className="sidebar-icon">
            {/* Users icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="7" r="4"/>
              <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              <path d="M21 21v-2a4 4 0 0 0-3-3.85"/>
            </svg>
          </span>
          <span>Utilisateurs</span>
        </Link>

        <Link
          to="/codes"
          className={`sidebar-link ${location.pathname === "/codes" ? "active" : ""}`}
        >
          <span className="sidebar-icon">
            {/* Key icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="7.5" cy="15.5" r="5.5"/>
              <path d="M21 2l-9.6 9.6"/>
              <path d="M15.5 7.5l3 3L22 7l-3-3"/>
            </svg>
          </span>
          <span>Codes</span>
        </Link>

        <Link
          to="/domaines"
          className={`sidebar-link ${location.pathname === "/domaines" ? "active" : ""}`}
        >
          <span className="sidebar-icon">
            {/* Globe icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </span>
          <span>Domaines</span>
        </Link>

        <Link
          to="/banques"
          className={`sidebar-link ${location.pathname === "/banques" ? "active" : ""}`}
        >
          <span className="sidebar-icon">
            {/* Bank icon */}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="3,9 12,2 21,9"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="3" y1="22" x2="21" y2="22"/>
              <line x1="5" y1="9" x2="5" y2="22"/>
              <line x1="10" y1="9" x2="10" y2="22"/>
              <line x1="14" y1="9" x2="14" y2="22"/>
              <line x1="19" y1="9" x2="19" y2="22"/>
            </svg>
          </span>
          <span>Banques</span>
        </Link>

      </nav>

      {/* ===== USER BADGE ===== */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">A</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">Administrateur</span>
          <span className="sidebar-user-role">Super Admin</span>
        </div>
      </div>

      {/* ===== FOOTER / LOGOUT ===== */}
      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          <span className="sidebar-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span>Déconnexion</span>
        </button>
      </div>

    </div>
  );
}