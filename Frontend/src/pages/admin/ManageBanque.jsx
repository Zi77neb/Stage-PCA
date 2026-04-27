import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageBanques.css";

export default function ManageBanques() {
  const [banques, setBanques] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const loadBanques = async () => {
    try {
      const res = await API.get("/admin/banques");
      setBanques(res.data);
    } catch (e) {
      console.error(e);
      alert("Erreur chargement banques");
    }
  };

  useEffect(() => { loadBanques(); }, []);

  // ➕ CREATE
  const createBanque = async () => {
    if (!name) { alert("Nom obligatoire"); return; }
    try {
      await API.post("/admin/banques", { name });
      setName("");
      loadBanques();
    } catch (e) {
      alert("Erreur création");
    }
  };

  // ✏️ START EDIT
  const startEdit = (b) => {
    setEditId(b.id);
    setEditName(b.name);
  };

  // ✅ CONFIRM EDIT
  const confirmEdit = async (id) => {
    try {
      await API.put(`/admin/banques/${id}`, { name: editName });
      setEditId(null);
      setEditName("");
      loadBanques();
    } catch (e) {
      alert("Erreur modification");
    }
  };

  // ❌ DELETE
  const deleteBanque = async (id) => {
    if (!window.confirm("Supprimer cette banque ?")) return;
    try {
      await API.delete(`/admin/banques/${id}`);
      loadBanques();
    } catch (e) {
      alert("Erreur suppression");
    }
  };

  return (
    <div className="banques-container">

      {/* ===== HEADER ===== */}
      <div className="banques-header">
        <h2 className="banques-title">🏦 Gestion des Banques</h2>
        <p className="banques-subtitle">Ajoutez, modifiez et gérez vos banques</p>
      </div>

      {/* ===== FORMULAIRE ===== */}
      <div className="banques-form-card">
        <h3 className="form-card-title">➕ Ajouter une banque</h3>
        <div className="banques-form">
          <input
            className="banques-input"
            placeholder="🏦 Nom de la banque"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createBanque()}
          />
          <button className="banques-btn-add" onClick={createBanque}>
            + Ajouter
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="banques-table-card">
        <h3 className="table-card-title">
          📋 Liste des Banques ({banques.length})
        </h3>

        {banques.length === 0 ? (
          <div className="banques-empty">
            <span>🏦</span>
            <p>Aucune banque enregistrée</p>
          </div>
        ) : (
          <table className="banques-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
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
                    {editId === b.id ? (
                      <input
                        className="banques-input-inline"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && confirmEdit(b.id)}
                        autoFocus
                      />
                    ) : (
                      <span className="banque-name">🏦 {b.name}</span>
                    )}
                  </td>
                  <td>
                    <div className="action-btns">
                      {editId === b.id ? (
                        <>
                          <button
                            className="btn-confirm"
                            onClick={() => confirmEdit(b.id)}
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
                            onClick={() => startEdit(b)}
                          >
                            ✏️ Modifier
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => deleteBanque(b.id)}
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