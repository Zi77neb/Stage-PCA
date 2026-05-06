import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageUsers.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [banques, setBanques] = useState([]);
  const [etats, setEtats] = useState([]);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "USER",
    banqueIds: [],
    domaineIds: [],
    etatIds: [],
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);

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
      const [u, d, b, e] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/domaines"),
        API.get("/admin/banques"),
        API.get("/admin/etats"),
      ]);

      setUsers(normalize(u.data));
      setDomaines(normalize(d.data));
      setBanques(normalize(b.data));
      setEtats(normalize(e.data));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchUsers = async () => {
    try {
      if (!search) return loadData();
      const res = await API.get(`/admin/users/search?username=${search}`);
      setUsers(normalize(res.data));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const toggle = (list, id) =>
    list.includes(id) ? list.filter((i) => i !== id) : [...list, id];

  const openCreate = () => {
    setEditId(null);
    setForm({
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "USER",
      banqueIds: [],
      domaineIds: [],
      etatIds: [],
    });
    setStep(1);
    setShowModal(true);
  };

  const createUser = async () => {
    try {
      await API.post("/admin/users", form);
      setShowModal(false);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const updateUser = async () => {
    try {
      await API.put(`/admin/users/${editId}`, form);
      setShowModal(false);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const loadUser = async (id) => {
    try {
      const res = await API.get(`/admin/users/${id}`);
      const u = res.data;

      setForm({
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        password: "",
        role: u.role,
        banqueIds: u.banques?.map((b) => b.id) || [],
        domaineIds: u.domaines?.map((d) => d.id) || [],
        etatIds: u.etats?.map((e) => e.id) || [],
      });

      setEditId(id);
      setStep(1);
      setShowModal(true);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?"))
      return;

    try {
      await API.delete(`/admin/users/${id}`);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  // Domaines selon banques
  const availableDomaines = domaines.filter((d) =>
    banques.some(
      (b) =>
        form.banqueIds.includes(b.id) &&
        (b.domaines || []).some((dd) => dd.id === d.id)
    )
  );

  // États selon domaines
  const availableEtats = etats.filter(
    (e) =>
      form.domaineIds.includes(e.domaineId) ||
      domaines.some(
        (d) => form.domaineIds.includes(d.id) && d.name === e.domaineName
      )
  );

  const steps = [
    { num: 1, label: "Informations", icon: "👤" },
    { num: 2, label: "Banques", icon: "🏦" },
    { num: 3, label: "Domaines", icon: "🌐" },
    { num: 4, label: "États", icon: "📊" },
  ];

  return (
    <div className="users-container">
      {/* ===== HEADER ===== */}
      <div className="users-header">
        <div>
          <h2 className="users-title">Gestion des Utilisateurs</h2>
          <p className="users-subtitle">
            Créez, modifiez et gérez les comptes utilisateurs
          </p>
        </div>
        <div className="users-header-badge">
          👥 {users.length} utilisateur{users.length > 1 ? "s" : ""}
        </div>
      </div>

      {error && (
        <div className="users-error-box">
          <span>⚠️</span> {error}
          <button className="error-close" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="users-toolbar">
        <div className="users-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="users-search-input"
            placeholder="Rechercher par username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchUsers()}
          />
          <button className="users-search-btn" onClick={searchUsers}>
            Rechercher
          </button>
        </div>
        <button className="users-btn-add" onClick={openCreate}>
          <span>➕</span> Nouvel utilisateur
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="users-table-card">
        <h3 className="users-table-title">Liste des utilisateurs</h3>

        {users.length === 0 ? (
          <div className="users-empty">
            <span>👤</span>
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Banques</th>
                <th>Domaines</th>
                <th>États</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <span className="badge-id">#{u.id}</span>
                  </td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {u.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="user-name">{u.username}</div>
                        <div className="user-fullname">{u.fullName}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="user-email">{u.email}</span>
                  </td>
                  <td>
                    <span
                      className={`role-badge ${
                        u.role?.toLowerCase() === "admin" ? "admin" : "user"
                      }`}
                    >
                      {u.role === "ADMIN" ? "👑" : "👤"} {u.role}
                    </span>
                  </td>
                  <td>
                    <span className="banque-badge">
                      🏦 {u.banques?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className="domaine-badge">
                      🌐 {u.domaines?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className="banque-badge">
                      📊 {u.etats?.length || 0}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-edit"
                        onClick={() => loadUser(u.id)}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteUser(u.id)}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            {/* MODAL HEADER */}
            <div className="modal-header">
              <h3 className="modal-title">
                {editId ? "✏️ Modifier l'utilisateur" : "➕ Nouvel utilisateur"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* STEPPER */}
            <div className="stepper">
              {steps.map((s, idx) => (
                <div key={s.num} className="stepper-item">
                  <div
                    className={`stepper-circle ${
                      step === s.num
                        ? "active"
                        : step > s.num
                        ? "done"
                        : ""
                    }`}
                  >
                    {step > s.num ? "✓" : s.icon}
                  </div>
                  <span
                    className={`stepper-label ${
                      step === s.num ? "active" : ""
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`stepper-line ${
                        step > s.num ? "done" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* MODAL BODY */}
            <div className="modal-body">
              {/* STEP 1 — INFOS */}
              {step === 1 && (
                <div className="modal-step">
                  <h4 className="step-title">Informations personnelles</h4>
                  <div className="step-grid">
                    <div className="users-field">
                      <label className="users-label">Username</label>
                      <input
                        className="users-input"
                        placeholder="ex: jdupont"
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                      />
                    </div>
                    <div className="users-field">
                      <label className="users-label">Nom complet</label>
                      <input
                        className="users-input"
                        placeholder="ex: Jean Dupont"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="users-field">
                      <label className="users-label">Email</label>
                      <input
                        className="users-input"
                        placeholder="ex: jean@exemple.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="users-field">
                      <label className="users-label">
                        Mot de passe{" "}
                        {editId && (
                          <span className="hint">(laisser vide si inchangé)</span>
                        )}
                      </label>
                      <input
                        className="users-input"
                        type="password"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="users-field">
                      <label className="users-label">Rôle</label>
                      <select
                        className="users-select"
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                      >
                        <option value="USER">👤 Utilisateur</option>
                        <option value="ADMIN">👑 Administrateur</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 — BANQUES */}
              {step === 2 && (
                <div className="modal-step">
                  <h4 className="step-title">Sélectionnez les banques</h4>
                  {banques.length === 0 ? (
                    <p className="step-empty">Aucune banque disponible</p>
                  ) : (
                    <div className="checkbox-grid">
                      {banques.map((b) => (
                        <label
                          key={b.id}
                          className={`checkbox-card ${
                            form.banqueIds.includes(b.id) ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.banqueIds.includes(b.id)}
                            onChange={() => {
                              const newBanques = toggle(form.banqueIds, b.id);
                              setForm({
                                ...form,
                                banqueIds: newBanques,
                                domaineIds: [],
                                etatIds: [],
                              });
                            }}
                          />
                          <span className="checkbox-icon">🏦</span>
                          <span className="checkbox-label">{b.name}</span>
                          <span className="checkbox-mark">✓</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3 — DOMAINES */}
              {step === 3 && (
                <div className="modal-step">
                  <h4 className="step-title">Sélectionnez les domaines</h4>
                  {availableDomaines.length === 0 ? (
                    <p className="step-empty">
                      Aucun domaine disponible — sélectionnez d'abord une banque
                    </p>
                  ) : (
                    <div className="checkbox-grid">
                      {availableDomaines.map((d) => (
                        <label
                          key={d.id}
                          className={`checkbox-card ${
                            form.domaineIds.includes(d.id) ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.domaineIds.includes(d.id)}
                            onChange={() =>
                              setForm({
                                ...form,
                                domaineIds: toggle(form.domaineIds, d.id),
                                etatIds: [],
                              })
                            }
                          />
                          <span className="checkbox-icon">🌐</span>
                          <span className="checkbox-label">{d.name}</span>
                          <span className="checkbox-mark">✓</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4 — ÉTATS */}
              {step === 4 && (
                <div className="modal-step">
                  <h4 className="step-title">Sélectionnez les états</h4>
                  {availableEtats.length === 0 ? (
                    <p className="step-empty">
                      Aucun état disponible — sélectionnez d'abord un domaine
                    </p>
                  ) : (
                    <div className="checkbox-grid">
                      {availableEtats.map((e) => (
                        <label
                          key={e.id}
                          className={`checkbox-card ${
                            form.etatIds.includes(e.id) ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={form.etatIds.includes(e.id)}
                            onChange={() =>
                              setForm({
                                ...form,
                                etatIds: toggle(form.etatIds, e.id),
                              })
                            }
                          />
                          <span className="checkbox-icon">📊</span>
                          <span className="checkbox-label">
                            <strong>{e.code}</strong>
                            <small>{e.nom}</small>
                          </span>
                          <span className="checkbox-mark">✓</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              <div className="footer-right">
                {step > 1 && (
                  <button
                    className="btn-step-prev"
                    onClick={() => setStep(step - 1)}
                  >
                    ⬅️ Précédent
                  </button>
                )}
                {step < 4 && (
                  <button
                    className="btn-step-next"
                    onClick={() => setStep(step + 1)}
                  >
                    Suivant ➡️
                  </button>
                )}
                {step === 4 &&
                  (editId ? (
                    <button className="btn-confirm" onClick={updateUser}>
                      ✓ Mettre à jour
                    </button>
                  ) : (
                    <button className="btn-confirm" onClick={createUser}>
                      ✓ Créer l'utilisateur
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}