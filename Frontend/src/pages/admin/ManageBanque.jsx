import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageBanques.css";

export default function ManageBanques() {
  const [banques, setBanques] = useState([]);
  const [etats, setEtats] = useState([]);
  const [domaines, setDomaines] = useState([]);

  const [name, setName] = useState("");
  const [selectedDomaines, setSelectedDomaines] = useState([]);
  const [selectedEtats, setSelectedEtats] = useState([]);

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
      const [b, e, d] = await Promise.all([
        API.get("/admin/banques"),
        API.get("/admin/etats"),
        API.get("/admin/domaines"),
      ]);

      setBanques(normalize(b.data));
      setEtats(normalize(e.data));
      setDomaines(normalize(d.data));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const searchBanques = async () => {
    try {
      if (!search) return loadData();
      const res = await API.get(`/admin/banques/search?name=${search}`);
      setBanques(normalize(res.data));
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const toggle = (list, id) =>
    list.includes(id) ? list.filter((i) => i !== id) : [...list, id];

  const openCreate = () => {
    setEditId(null);
    setName("");
    setSelectedDomaines([]);
    setSelectedEtats([]);
    setStep(1);
    setShowModal(true);
  };

  const createBanque = async () => {
    try {
      await API.post("/admin/banques", {
        name,
        domaineIds: selectedDomaines,
        etatIds: selectedEtats,
      });

      setShowModal(false);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const loadBanque = async (id) => {
    try {
      const res = await API.get(`/admin/banques/${id}`);
      const b = res.data;

      setName(b.name);
      setSelectedDomaines(b.domaines?.map((d) => d.id) || []);
      setSelectedEtats(b.etats?.map((e) => e.id) || []);

      setEditId(id);
      setStep(1);
      setShowModal(true);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const updateBanque = async () => {
    try {
      await API.put(`/admin/banques/${editId}`, {
        name,
        domaineIds: selectedDomaines,
        etatIds: selectedEtats,
      });

      setShowModal(false);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  const deleteBanque = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette banque ?"))
      return;

    try {
      await API.delete(`/admin/banques/${id}`);
      loadData();
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  // États disponibles selon les domaines sélectionnés
  const availableEtats = etats.filter(
    (e) =>
      selectedDomaines.includes(e.domaineId) ||
      domaines.some(
        (d) => selectedDomaines.includes(d.id) && d.name === e.domaineName
      )
  );

  const steps = [
    { num: 1, label: "Information", icon: "🏦" },
    { num: 2, label: "Domaines", icon: "🌐" },
    { num: 3, label: "États", icon: "📊" },
  ];

  return (
    <div className="banques-container">
      {/* ===== HEADER ===== */}
      <div className="banques-header">
        <div>
          <h2 className="banques-title">Gestion des Banques</h2>
          <p className="banques-subtitle">
            Configurez les banques et leurs domaines associés
          </p>
        </div>
        <div className="banques-header-badge">
          🏦 {banques.length} banque{banques.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="banques-error-box">
          <span>⚠️</span> {error}
          <button className="error-close" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="banques-toolbar">
        <div className="banques-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="banques-search-input"
            placeholder="Rechercher une banque..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchBanques()}
          />
          <button className="banques-search-btn" onClick={searchBanques}>
            Rechercher
          </button>
        </div>
        <button className="banques-btn-add" onClick={openCreate}>
          <span>➕</span> Nouvelle banque
        </button>
      </div>

      {/* ===== TABLE ===== */}
      <div className="banques-table-card">
        <h3 className="banques-table-title">Liste des banques</h3>

        {banques.length === 0 ? (
          <div className="banques-empty">
            <span>🏦</span>
            <p>Aucune banque trouvée</p>
          </div>
        ) : (
          <table className="banques-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Domaines</th>
                <th>États</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {banques.map((b) => (
                <tr key={b.id}>
                  <td>
                    <span className="badge-id">#{b.id}</span>
                  </td>
                  <td>
                    <span className="banque-name">{b.name}</span>
                  </td>
                  <td>
                    <span className="domaine-badge">
                      🌐 {b.domaines?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className="etat-badge">
                      📊 {b.etats?.length || 0}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="btn-edit"
                        onClick={() => loadBanque(b.id)}
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => deleteBanque(b.id)}
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
                {editId ? "✏️ Modifier la banque" : "➕ Nouvelle banque"}
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
                      step === s.num ? "active" : step > s.num ? "done" : ""
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
                      className={`stepper-line ${step > s.num ? "done" : ""}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* STEP 1 — NOM */}
              {step === 1 && (
                <div className="modal-step">
                  <h4 className="step-title">Informations de la banque</h4>
                  <div className="banques-field">
                    <label className="banques-label">
                      Nom de la banque <span className="required">*</span>
                    </label>
                    <input
                      className="banques-input"
                      placeholder="ex: Banque Centrale Populaire"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                    />
                    <small className="field-hint">
                      💡 Choisissez un nom unique et explicite
                    </small>
                  </div>
                </div>
              )}

              {/* STEP 2 — DOMAINES */}
              {step === 2 && (
                <div className="modal-step">
                  <h4 className="step-title">Sélectionnez les domaines</h4>
                  {domaines.length === 0 ? (
                    <p className="step-empty">Aucun domaine disponible</p>
                  ) : (
                    <div className="checkbox-grid">
                      {domaines.map((d) => (
                        <label
                          key={d.id}
                          className={`checkbox-card ${
                            selectedDomaines.includes(d.id) ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedDomaines.includes(d.id)}
                            onChange={() => {
                              const newDom = toggle(selectedDomaines, d.id);
                              setSelectedDomaines(newDom);
                              setSelectedEtats([]);
                            }}
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

              {/* STEP 3 — ÉTATS */}
              {step === 3 && (
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
                            selectedEtats.includes(e.id) ? "checked" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedEtats.includes(e.id)}
                            onChange={() =>
                              setSelectedEtats(toggle(selectedEtats, e.id))
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

            {/* FOOTER */}
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
                {step < 3 && (
                  <button
                    className="btn-step-next"
                    onClick={() => setStep(step + 1)}
                    disabled={step === 1 && !name.trim()}
                  >
                    Suivant ➡️
                  </button>
                )}
                {step === 3 &&
                  (editId ? (
                    <button className="btn-confirm" onClick={updateBanque}>
                      ✓ Mettre à jour
                    </button>
                  ) : (
                    <button className="btn-confirm" onClick={createBanque}>
                      ✓ Créer la banque
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