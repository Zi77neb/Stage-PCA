import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    codes: 0,
    domaines: 0,
    banques: 0,
    codesUsed: 0,
    codesAvailable: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCodes, setRecentCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [users, codes, domaines, banques] = await Promise.all([
          API.get("/admin/users"),
          API.get("/admin/codes"),
          API.get("/admin/domaines"),
          API.get("/admin/banques"),
        ]);

        const codesUsed      = codes.data.filter((c) => c.used).length;
        const codesAvailable = codes.data.filter((c) => !c.used).length;

        setStats({
          users:          users.data.length,
          codes:          codes.data.length,
          domaines:       domaines.data.length,
          banques:        banques.data.length,
          codesUsed,
          codesAvailable,
        });

        setRecentUsers(users.data.slice(-5).reverse());
        setRecentCodes(codes.data.slice(-5).reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">

      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">📊 Tableau de Bord</h1>
          <p className="dashboard-subtitle">
            Bienvenue dans votre panneau d'administration
          </p>
        </div>
        <div className="dashboard-date">
          🗓️ {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            year:    "numeric",
            month:   "long",
            day:     "numeric",
          })}
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="stats-grid">

        <div className="stat-card" onClick={() => navigate("/users")}>
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <span className="stat-number">{stats.users}</span>
            <span className="stat-label">Utilisateurs</span>
          </div>
          <div className="stat-arrow">→</div>
        </div>

        <div className="stat-card" onClick={() => navigate("/codes")}>
          <div className="stat-icon codes">🔑</div>
          <div className="stat-info">
            <span className="stat-number">{stats.codes}</span>
            <span className="stat-label">Codes Total</span>
          </div>
          <div className="stat-arrow">→</div>
        </div>

        <div className="stat-card" onClick={() => navigate("/domaines")}>
          <div className="stat-icon domaines">🌐</div>
          <div className="stat-info">
            <span className="stat-number">{stats.domaines}</span>
            <span className="stat-label">Domaines</span>
          </div>
          <div className="stat-arrow">→</div>
        </div>

        <div className="stat-card" onClick={() => navigate("/banques")}>
          <div className="stat-icon banques">🏦</div>
          <div className="stat-info">
            <span className="stat-number">{stats.banques}</span>
            <span className="stat-label">Banques</span>
          </div>
          <div className="stat-arrow">→</div>
        </div>

      </div>

      

      {/* ===== GRILLE BAS ===== */}
      <div className="dashboard-bottom-grid">

        {/* Derniers utilisateurs */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="section-title">👥 Derniers Utilisateurs</h3>
            <button
              className="card-link"
              onClick={() => navigate("/users")}
            >
              Voir tout →
            </button>
          </div>
          {recentUsers.length === 0 ? (
            <p className="card-empty">Aucun utilisateur</p>
          ) : (
            <ul className="card-list">
              {recentUsers.map((u) => (
                <li key={u.id} className="card-list-item">
                  <div className="user-avatar-sm">
                    {u.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="card-item-name">{u.username}</span>
                  <span className={`role-badge-sm ${u.role === "ADMIN" ? "admin" : "user"}`}>
                    {u.role === "ADMIN" ? "👑 ADMIN" : "👤 USER"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Derniers codes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="section-title">🔑 Derniers Codes</h3>
            <button
              className="card-link"
              onClick={() => navigate("/codes")}
            >
              Voir tout →
            </button>
          </div>
          {recentCodes.length === 0 ? (
            <p className="card-empty">Aucun code</p>
          ) : (
            <ul className="card-list">
              {recentCodes.map((c) => (
                <li key={c.id} className="card-list-item">
                  <span className="code-value-sm">🔑 {c.code}</span>
                  <span className="code-domaine-sm">
                    🌐 {c.domaine?.name ?? "—"}
                  </span>
                  <span className={`status-badge-sm ${c.used ? "used" : "available"}`}>
                    {c.used ? "Utilisé" : "Disponible"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Accès rapides */}
        <div className="dashboard-card">
          <h3 className="section-title">⚡ Accès Rapides</h3>
          <div className="quick-actions">
            <button
              className="quick-btn"
              onClick={() => navigate("/users")}
            >
              <span>👥</span>
              <span>Gérer Utilisateurs</span>
            </button>
            <button
              className="quick-btn"
              onClick={() => navigate("/codes")}
            >
              <span>🔑</span>
              <span>Gérer Codes</span>
            </button>
            <button
              className="quick-btn"
              onClick={() => navigate("/domaines")}
            >
              <span>🌐</span>
              <span>Gérer Domaines</span>
            </button>
            <button
              className="quick-btn"
              onClick={() => navigate("/banques")}
            >
              <span>🏦</span>
              <span>Gérer Banques</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}