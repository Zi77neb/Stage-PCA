import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageDomaines.css";

export default function ManageDomaines() {
  const [domaines, setDomaines] = useState([]);

  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);

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
      const d = await API.get("/admin/domaines");
      setDomaines(normalize(d.data));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchDomaines = async () => {
    try {
      if (!search) return loadData();
      const res = await API.get(`/admin/domaines/search?name=${search}`);
      setDomaines(normalize(res.data));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const openCreate = () => {
    setEditId(null);
    setName("");
    setShowModal(true);
  };

  const createDomaine = async () => {
    if (!name) {
      setError("Nom obligatoire");
      return;
    }

    try {
      await API.post("/admin/domaines", { name });
      setShowModal(false);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const loadDomaine = async (id) => {
    try {
      const res = await API.get(`/admin/domaines/${id}`);
      const d = res.data;
      setName(d.name);
      setEditId(id);
      setShowModal(true);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const updateDomaine = async () => {
    if (!name) {
      setError("Nom obligatoire");
      return;
    }

    try {
      await API.put(`/admin/domaines/${editId}`, { name });
      setShowModal(false);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const deleteDomaine = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce domaine ?"))
      return;

    try {
      await API.delete(`/admin/domaines/${id}`);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const handleSubmit = () => {
    if (editId) {
      updateDomaine();
    } else {
      createDomaine();
    }
  };

  return (
    <div className="domaines-container">
      {/* ===== HEADER ===== */}
      <div className="domaines-header">
        <div>
          <h2 className="domaines-title">Gestion des Domaines</h2>
          <p className="domaines-subtitle">
            Organisez et catégorisez les domaines fonctionnels
          </p>
        </div>
        <div className="domaines-header-badge">
          🌐 {domaines.length} domaine{domaines.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="domaines-error-box">
          <span>⚠️</span> {error}
          <button className="error-close" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="domaines-toolbar">
        <div className="domaines-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="domaines-search-input"
            placeholder="Rechercher un domaine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchDomaines()}
          />
          <button className="domaines-search-btn" onClick={searchDomaines}>
            Rechercher
          </button>
        </div>
        <button className="domaines-btn-add" onClick={openCreate}>
          <span>➕</span> Nouveau domaine
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="domaines-table-card">
        <h3 className="domaines-table-title">Liste des domaines</h3>

        {domaines.length === 0 ? (
          <div className="domaines-empty">
            <span>🌐</span>
            <p>Aucun domaine trouvé</p>
          </div>
        ) : (
          <table className="domaines-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom du domaine</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {domaines.map((d) => (
                <tr key={d.id}>
                  <td>
                    <span className="badge-id">#{d.id}</span>
                  </td>
                  <td>
                    <span className="domaine-name">
                      <span className="domaine-icon">🌐</span>
                      {d.name}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-edit"
                        onClick={() => loadDomaine(d.id)}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteDomaine(d.id)}
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
            {/* HEADER */}
            <div className="modal-header">
              <h3 className="modal-title">
                {editId ? "✏️ Modifier le domaine" : "➕ Nouveau domaine"}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            <div className="modal-body">
              <div className="domaine-icon-banner">
                <span>🌐</span>
              </div>

              <div className="domaines-field">
                <label className="domaines-label">
                  Nom du domaine <span className="required">*</span>
                </label>
                <input
                  className="domaines-input"
                  placeholder="ex: Comptabilité, Risques, Trésorerie..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
                <small className="field-hint">
                  💡 Choisissez un nom court et explicite pour ce domaine
                </small>
              </div>
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>

              {editId ? (
                <button className="btn-confirm" onClick={updateDomaine}>
                  ✓ Mettre à jour
                </button>
              ) : (
                <button className="btn-confirm" onClick={createDomaine}>
                  ✓ Créer le domaine
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}