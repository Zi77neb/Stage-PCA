import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    users: 0,
    etats: 0,
    domaines: 0,
    banques: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEtats, setRecentEtats] = useState([]);

  const [searchUser, setSearchUser] = useState("");
  const [searchEtat, setSearchEtat] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Erreur serveur"
    );
  };

  const normalize = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersRes, etatsRes, domainesRes, banquesRes] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/etats"),
        API.get("/admin/domaines"),
        API.get("/admin/banques"),
      ]);

      const users = normalize(usersRes.data);
      const etats = normalize(etatsRes.data);
      const domaines = normalize(domainesRes.data);
      const banques = normalize(banquesRes.data);

      setStats({
        users: users.length,
        etats: etats.length,
        domaines: domaines.length,
        banques: banques.length,
      });

      setRecentUsers(users.slice(-5).reverse());
      setRecentEtats(etats.slice(-5).reverse());

      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchUsers = async () => {
    try {
      if (!searchUser) return loadData();
      const res = await API.get(`/admin/users/search?username=${searchUser}`);
      setRecentUsers(normalize(res.data));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const searchEtats = async () => {
    try {
      if (!searchEtat) return loadData();
      const res = await API.get(`/admin/etats/search?nom=${searchEtat}`);
      setRecentEtats(normalize(res.data));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <span className="error-icon">⚠️</span>
        <h2>Une erreur est survenue</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={loadData}>
          🔄 Réessayer
        </button>
      </div>
    );
  }

  const statsData = [
    { key: "users", label: "Utilisateurs", value: stats.users, icon: "👥", route: "/users" },
    { key: "codes", label: "États", value: stats.etats, icon: "📊", route: "/etats" },
    { key: "domaines", label: "Domaines", value: stats.domaines, icon: "🌐", route: "/domaines" },
    { key: "banques", label: "Banques", value: stats.banques, icon: "🏦", route: "/banques" },
  ];

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Tableau de bord Admin</h1>
          <p className="dashboard-subtitle">
            Vue d'ensemble de votre plateforme
          </p>
        </div>
        <div className="dashboard-date">📅 {today}</div>
      </div>

      {/* STATS GRID */}
      <div className="stats-grid">
        {statsData.map((s) => (
          <div
            key={s.key}
            className="stat-card"
            onClick={() => navigate(s.route)}
          >
            <div className={`stat-icon ${s.key}`}>{s.icon}</div>
            <div className="stat-info">
              <span className="stat-number">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
            <span className="stat-arrow">›</span>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="dashboard-bottom-grid">
        {/* USERS CARD */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="section-title">👥 Utilisateurs</h3>
            <button className="card-link" onClick={() => navigate("/users")}>
              Voir tout
            </button>
          </div>

          <div className="search-bar">
            <input
              className="search-input"
              placeholder="🔍 Rechercher par username..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchUsers()}
            />
            <button className="search-btn" onClick={searchUsers}>
              Rechercher
            </button>
          </div>

          {recentUsers.length === 0 ? (
            <p className="card-empty">Aucun utilisateur trouvé</p>
          ) : (
            <ul className="card-list">
              {recentUsers.map((u) => (
                <li key={u.id} className="card-list-item">
                  <div className="user-avatar-sm">
                    {u.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="card-item-name">{u.username}</span>
                  <span
                    className={`role-badge-sm ${
                      u.role?.toLowerCase() === "admin" ? "admin" : "user"
                    }`}
                  >
                    {u.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ETATS CARD */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="section-title">📊 États</h3>
            <button className="card-link" onClick={() => navigate("/etats")}>
              Voir tout
            </button>
          </div>

          <div className="search-bar">
            <input
              className="search-input"
              placeholder="🔍 Rechercher par nom..."
              value={searchEtat}
              onChange={(e) => setSearchEtat(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchEtats()}
            />
            <button className="search-btn" onClick={searchEtats}>
              Rechercher
            </button>
          </div>

          {recentEtats.length === 0 ? (
            <p className="card-empty">Aucun état trouvé</p>
          ) : (
            <ul className="card-list">
              {recentEtats.map((e) => (
                <li key={e.id} className="card-list-item">
                  <span className="code-value-sm">{e.code}</span>
                  <span className="code-domaine-sm">{e.nom}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* QUICK ACTIONS CARD */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="section-title">⚡ Actions rapides</h3>
          </div>

          <div className="quick-actions">
            <button className="quick-btn" onClick={() => navigate("/users")}>
              <span>👥</span>
              <span>Utilisateurs</span>
            </button>
            <button className="quick-btn" onClick={() => navigate("/etats")}>
              <span>📊</span>
              <span>États</span>
            </button>
            <button className="quick-btn" onClick={() => navigate("/domaines")}>
              <span>🌐</span>
              <span>Domaines</span>
            </button>
            <button className="quick-btn" onClick={() => navigate("/banques")}>
              <span>🏦</span>
              <span>Banques</span>
            </button>
            <button
              className="quick-btn full-width"
              onClick={() => navigate("/traces")}
            >
              <span>🔍</span>
              <span>Traçabilité</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}