import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [banques, setBanques] = useState([]);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "USER",
    banqueId: "",
    domaineId: ""
  });

  // 🔄 LOAD DATA
  const loadData = async () => {
    const u = await API.get("/admin/users");
    const d = await API.get("/admin/domaines");
    const b = await API.get("/admin/banques");
    setUsers(u.data);
    setDomaines(d.data);
    setBanques(b.data);
  };

  useEffect(() => { loadData(); }, []);

  // ➕ CREATE USER
  const createUser = async () => {
    try {
      await API.post("/admin/users", form);
      setForm({ username: "", fullName: "", email: "", role: "USER", banqueId: "", domaineId: "" });
      loadData();
    } catch (e) {
      console.error(e);
      alert("Erreur création utilisateur");
    }
  };

  // ❌ DELETE
  const deleteUser = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await API.delete(`/admin/users/${id}`);
    loadData();
  };

  // 🔥 FILTRAGE DOMAINES PAR BANQUE
  const filteredDomaines = domaines.filter(
    (d) => d.banque?.id === Number(form.banqueId)
  );

  return (
    <div className="users-container">

      {/* ===== HEADER ===== */}
      <div className="users-header">
        <h2 className="users-title">👥 Gestion des Utilisateurs</h2>
        <p className="users-subtitle">Ajoutez et gérez les comptes utilisateurs</p>
      </div>

      {/* ===== FORMULAIRE ===== */}
      <div className="users-form-card">
        <h3 className="users-form-title">➕ Ajouter un utilisateur</h3>

        <div className="users-form-grid">

          <div className="users-field">
            <label className="users-label">👤 Nom d'utilisateur</label>
            <input
              className="users-input"
              placeholder="Nom d'utilisateur"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="users-field">
            <label className="users-label">📛 Nom complet</label>
            <input
              className="users-input"
              placeholder="Nom complet"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="users-field">
            <label className="users-label">📧 Email</label>
            <input
              className="users-input"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="users-field">
            <label className="users-label">🎭 Rôle</label>
            <select
              className="users-select"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="USER">👤 USER</option>
              <option value="ADMIN">👑 ADMIN</option>
            </select>
          </div>

          <div className="users-field">
            <label className="users-label">🏦 Banque</label>
            <select
              className="users-select"
              value={form.banqueId}
              onChange={(e) => setForm({ ...form, banqueId: e.target.value, domaineId: "" })}
            >
              <option value="">Choisir une banque</option>
              {banques.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="users-field">
            <label className="users-label">🌐 Domaine</label>
            <select
              className={`users-select ${!form.banqueId ? "disabled" : ""}`}
              value={form.domaineId}
              onChange={(e) => setForm({ ...form, domaineId: e.target.value })}
              disabled={!form.banqueId}
            >
              <option value="">
                {form.banqueId ? "Choisir un domaine" : "Sélectionnez d'abord une banque"}
              </option>
              {filteredDomaines.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="users-form-footer">
          <button className="users-btn-add" onClick={createUser}>
            ➕ Ajouter l'utilisateur
          </button>
        </div>

      </div>

      {/* ===== TABLE ===== */}
      <div className="users-table-card">
        <h3 className="users-table-title">📋 Liste des Utilisateurs ({users.length})</h3>

        {users.length === 0 ? (
          <div className="users-empty">
            <span>👥</span>
            <p>Aucun utilisateur enregistré</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Nom complet</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Domaine</th>
                <th>Banque</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td><span className="badge-id">#{u.id}</span></td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name">{u.username}</span>
                    </div>
                  </td>
                  <td><span className="user-fullname">{u.fullName || "—"}</span></td>
                  <td><span className="user-email">📧 {u.email || "—"}</span></td>
                  <td>
                    <span className={`role-badge ${u.role === "ADMIN" ? "admin" : "user"}`}>
                      {u.role === "ADMIN" ? "👑 ADMIN" : "👤 USER"}
                    </span>
                  </td>
                  <td>
                    <span className="domaine-badge">
                      {u.domaine?.name ? `🌐 ${u.domaine.name}` : "—"}
                    </span>
                  </td>
                  <td>
                    <span className="banque-badge">
                      {u.banque?.name ? `🏦 ${u.banque.name}` : "—"}
                    </span>
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => deleteUser(u.id)}>
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}