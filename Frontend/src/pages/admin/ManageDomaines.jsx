import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageDomaines.css";

export default function ManageDomaines() {
  const [domaines, setDomaines] = useState([]);
  const [banques, setBanques] = useState([]);
  const [form, setForm] = useState({ name: "", banqueId: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", banqueId: "" });

  const loadData = async () => {
    const d = await API.get("/admin/domaines");
    const b = await API.get("/admin/banques");
    setDomaines(d.data);
    setBanques(b.data);
  };

  useEffect(() => { loadData(); }, []);

  // ➕ CREATE
  const createDomaine = async () => {
    if (!form.name || !form.banqueId) {
      alert("Nom et banque obligatoires");
      return;
    }
    await API.post("/admin/domaines", form);
    setForm({ name: "", banqueId: "" });
    loadData();
  };

  // ✏️ START EDIT
  const startEdit = (d) => {
    setEditId(d.id);
    setEditForm({ name: d.name, banqueId: d.banque?.id || "" });
  };

  // ✅ CONFIRM EDIT
  const confirmEdit = async (id) => {
    try {
      await API.put(`/admin/domaines/${id}`, editForm);
      setEditId(null);
      loadData();
    } catch (e) {
      alert("Erreur modification");
    }
  };

  // ❌ DELETE
  const deleteDomaine = async (id) => {
    if (!window.confirm("Supprimer ce domaine ?")) return;
    try {
      await API.delete(`/admin/domaines/${id}`);
      loadData();
    } catch (e) {
      alert("Erreur suppression");
    }
  };

  return (
    <div className="domaines-container">

      {/* ===== HEADER ===== */}
      <div className="domaines-header">
        <h2 className="domaines-title">🌐 Gestion des Domaines</h2>
        <p className="domaines-subtitle">Ajoutez, modifiez et gérez vos domaines</p>
      </div>

      {/* ===== FORMULAIRE ===== */}
      <div className="domaines-form-card">
        <h3 className="form-card-title">➕ Ajouter un domaine</h3>
        <div className="domaines-form">
          <input
            className="domaines-input"
            placeholder="🌐 Nom du domaine"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && createDomaine()}
          />
          <select
            className="domaines-select"
            value={form.banqueId}
            onChange={(e) => setForm({ ...form, banqueId: e.target.value })}
          >
            <option value="">🏦 Choisir une banque</option>
            {banques.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <button className="domaines-btn-add" onClick={createDomaine}>
            + Ajouter
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="domaines-table-card">
        <h3 className="table-card-title">
          📋 Liste des Domaines ({domaines.length})
        </h3>

        {domaines.length === 0 ? (
          <div className="domaines-empty">
            <span>🌐</span>
            <p>Aucun domaine enregistré</p>
          </div>
        ) : (
          <table className="domaines-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Banque</th>
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
                    {editId === d.id ? (
                      <input
                        className="domaines-input-inline"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        autoFocus
                      />
                    ) : (
                      <span className="domaine-name">🌐 {d.name}</span>
                    )}
                  </td>
                  <td>
                    {editId === d.id ? (
                      <select
                        className="domaines-select-inline"
                        value={editForm.banqueId}
                        onChange={(e) =>
                          setEditForm({ ...editForm, banqueId: e.target.value })
                        }
                      >
                        <option value="">Choisir banque</option>
                        {banques.map((b) => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="domaine-banque">🏦 {d.banque?.name}</span>
                    )}
                  </td>
                  <td>
                    <div className="action-btns">
                      {editId === d.id ? (
                        <>
                          <button
                            className="btn-confirm"
                            onClick={() => confirmEdit(d.id)}
                          >
                            ✅ Confirmer
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={() => setEditId(null)}
                          >
                            ✖ Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn-edit"
                            onClick={() => startEdit(d)}
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteDomaine(d.id)}
                          >
                            🗑️ Supprimer
                          </button>
                        </>
                      )}
                    </div>
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