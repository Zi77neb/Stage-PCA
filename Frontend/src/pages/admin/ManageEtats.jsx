import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageEtats.css";

export default function ManageEtats() {
  const [etats, setEtats] = useState([]);
  const [domaines, setDomaines] = useState([]);

  const [code, setCode] = useState("");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [frequence, setFrequence] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [domaineId, setDomaineId] = useState("");

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
      const e = await API.get("/admin/etats");
      setEtats(normalize(e.data));

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

  const searchEtats = async () => {
    try {
      if (!search) return loadData();
      const res = await API.get(`/admin/etats/search?code=${search}`);
      setEtats(normalize(res.data));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const openCreate = () => {
    setEditId(null);
    setCode("");
    setNom("");
    setDescription("");
    setFrequence("");
    setUploadFile(null);
    setDomaineId("");
    setShowModal(true);
  };

  const createEtat = async () => {
  if (!code || !nom || !domaineId) {
    setError("Code, nom et domaine obligatoires");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("code", code);
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("frequence", frequence);
    formData.append("domaineId", domaineId);

    if (uploadFile) {
      formData.append("file", uploadFile); // ✅
    }

    await API.post("/admin/etats/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setShowModal(false);
    loadData();
  } catch (err) {
    setError(getErrorMessage(err));
  }
};

  const loadEtat = async (id) => {
    try {
      const res = await API.get(`/admin/etats/${id}`);
      const e = res.data;

      setCode(e.code || "");
      setNom(e.nom || "");
      setDescription(e.description || "");
      setFrequence(e.frequence || "");
      setUploadFile(e.uploadFile || "");
      setDomaineId(e.domaine?.id || "");

      setEditId(id);
      setShowModal(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

 const updateEtat = async () => {
  if (!code || !nom || !domaineId) {
    setError("Code, nom et domaine obligatoires");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("code", code);
    formData.append("nom", nom);
    formData.append("description", description);
    formData.append("frequence", frequence);
    formData.append("domaineId", domaineId);

    if (uploadFile) {
      formData.append("file", uploadFile);
    }

    await API.put(`/admin/etats/upload/${editId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setShowModal(false);
    loadData();
  } catch (err) {
    setError(getErrorMessage(err));
  }
};
  const deleteEtat = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet état ?"))
      return;

    try {
      await API.delete(`/admin/etats/${id}`);
      loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setUploadFile(file); // ✅ garder le fichier réel
  }
};

// 🔥 Fonction pour visualiser
const viewPdf = (path) => {
  if (!path || path === "" || path === "/") {
    alert("Aucun fichier n'est associé à cet état.");
    return;
  }

  // ✅ path = http://localhost:8080/etatsFile/nom.pdf
  window.open(path, "_blank");
};

  const frequenceLabels = {
    HOURLY: { label: "Chaque heure", icon: "⏰" },
    DAILY: { label: "Quotidien", icon: "📅" },
    WEEKLY: { label: "Hebdomadaire", icon: "📆" },
    MONTHLY: { label: "Mensuel", icon: "🗓️" },
    YEARLY: { label: "Annuel", icon: "📈" },
  };

  return (
    <div className="etats-container">
      {/* ===== HEADER ===== */}
      <div className="etats-header">
        <div>
          <h2 className="etats-title">Gestion des États</h2>
          <p className="etats-subtitle">
            Configurez les états réglementaires et leur fréquence
          </p>
        </div>
        <div className="etats-header-badge">
          📊 {etats.length} état{etats.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="etats-error-box">
          <span>⚠️</span> {error}
          <button className="error-close" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="etats-toolbar">
        <div className="etats-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="etats-search-input"
            placeholder="Rechercher par nom d'état..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchEtats()}
          />
          <button className="etats-search-btn" onClick={searchEtats}>
            Rechercher
          </button>
        </div>
        <button className="etats-btn-add" onClick={openCreate}>
          <span>➕</span> Nouvel état
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="etats-table-card">
        <h3 className="etats-table-title">Liste des états</h3>

        {etats.length === 0 ? (
          <div className="etats-empty">
            <span>📊</span>
            <p>Aucun état trouvé</p>
          </div>
        ) : (
          <table className="etats-table">
            <thead>
              <tr><th>Code</th><th>Nom</th><th>Description</th><th>Fréquence</th><th>Domaine</th><th>Aperçu</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {etats.map((e) => (
                <tr key={e.id}>
                  <td><span className="etat-code">{e.code}</span></td>
                  <td><span className="etat-nom">{e.nom}</span></td>
                  <td><span className="etat-description">{e.description || <em className="text-muted">—</em>}</span></td>
                  <td>{e.frequence ? <span className="frequence-badge">{frequenceLabels[e.frequence]?.icon || "⏱️"} {frequenceLabels[e.frequence]?.label || e.frequence}</span> : <em className="text-muted">—</em>}</td>
                  <td><span className="domaine-badge">🌐 {e.domaineName || "—"}</span></td>
                  <td><button className="btn-view" onClick={() => viewPdf(e.uploadPath)} title="Voir le document" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>👁️</button></td>
                  <td><div className="action-btns"><button className="btn-edit" onClick={() => loadEtat(e.id)}>✏️ Modifier</button><button className="btn-delete" onClick={() => deleteEtat(e.id)}>🗑️ Supprimer</button></div></td>
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
                {editId ? "✏️ Modifier l'état" : "➕ Nouvel état"}
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
              <div className="etats-form-grid">
                <div className="etats-field">
                  <label className="etats-label">
                    Code <span className="required">*</span>
                  </label>
                  <input
                    className="etats-input"
                    placeholder="ex: ETAT_001"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>

                <div className="etats-field">
                  <label className="etats-label">
                    Nom <span className="required">*</span>
                  </label>
                  <input
                    className="etats-input"
                    placeholder="ex: Bilan trimestriel"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>

                <div className="etats-field full-width">
                  <label className="etats-label">Description</label>
                  <input
                    className="etats-input"
                    placeholder="Brève description de l'état..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="etats-field">
                  <label className="etats-label">Fréquence</label>
                  <select
                    className="etats-select"
                    value={frequence}
                    onChange={(e) => setFrequence(e.target.value)}
                  >
                    <option value="">— Choisir une fréquence —</option>
                    <option value="HOURLY">⏰ Chaque heure</option>
                    <option value="DAILY">📅 Quotidien</option>
                    <option value="WEEKLY">📆 Hebdomadaire</option>
                    <option value="MONTHLY">🗓️ Mensuel</option>
                    <option value="YEARLY">📈 Annuel</option>
                  </select>
                </div>

                <div className="etats-field">
                  <label className="etats-label">
                    Domaine <span className="required">*</span>
                  </label>
                  <select
                    className="etats-select"
                    value={domaineId}
                    onChange={(e) => setDomaineId(e.target.value)}
                  >
                    <option value="">— Choisir un domaine —</option>
                    {domaines.map((d) => (
                      <option key={d.id} value={d.id}>
                        🌐 {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="etats-field full-width">
                  <label className="etats-label">Fichier de l'état</label>
                  <input
                    type="file"
                    className="etats-input"
                    onChange={handleFileChange}
                  />
                  {uploadFile && (
                    <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                      Fichier sélectionné : <strong>{uploadFile.name}</strong> ✅
                    </small>
                  )}
                </div>
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
                <button className="btn-confirm" onClick={updateEtat}>
                  ✓ Mettre à jour
                </button>
              ) : (
                <button className="btn-confirm" onClick={createEtat}>
                  ✓ Créer l'état
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}