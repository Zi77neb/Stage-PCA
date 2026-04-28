import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageCodes.css";

export default function ManageCodes() {
  const [codes, setCodes] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [form, setForm] = useState({ code: "", domaineId: "" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ code: "", domaineId: "" });

  const loadData = async () => {
    const c = await API.get("/admin/codes");

    // 🔥 IMPORTANT : bon endpoint
    const d = await API.get("/admin/domaines/with-banque");

    setCodes(c.data);
    setDomaines(d.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  // ➕ CREATE
  const createCode = async () => {
    if (!form.code || !form.domaineId) {
      alert("Code et domaine obligatoires");
      return;
    }

    await API.post("/admin/codes", form);
    setForm({ code: "", domaineId: "" });
    loadData();
  };

  // ✏️ START EDIT
  const startEdit = (c) => {
    setEditId(c.id);
    setEditForm({
      code: c.code,
      domaineId: c.domaine?.id || "",
    });
  };

  // ✅ CONFIRM EDIT
  const confirmEdit = async (id) => {
    try {
      await API.put(`/admin/codes/${id}`, editForm);
      setEditId(null);
      loadData();
    } catch (e) {
      alert("Erreur modification");
    }
  };

  // ❌ DELETE
  const deleteCode = async (id) => {
    if (!window.confirm("Supprimer ce code ?")) return;

    try {
      await API.delete(`/admin/codes/${id}`);
      loadData();
    } catch (e) {
      alert("Erreur suppression");
    }
  };

  return (
    <div className="codes-container">

      {/* ===== HEADER ===== */}
      <div className="codes-header">
        <h2 className="codes-title">🔑 Gestion des Codes</h2>
        <p className="codes-subtitle">
          Ajoutez, modifiez et gérez vos codes
        </p>
      </div>

      {/* ===== FORMULAIRE ===== */}
      <div className="codes-form-card">
        <h3 className="codes-form-title">➕ Ajouter un code</h3>

        <div className="codes-form">
          <input
            className="codes-input"
            placeholder="🔑 Entrez le code"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && createCode()}
          />

          <select
            className="codes-select"
            value={form.domaineId}
            onChange={(e) =>
              setForm({ ...form, domaineId: e.target.value })
            }
          >
            <option value="">🌐 Choisir un domaine</option>

            {domaines.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.banqueName})
              </option>
            ))}
          </select>

          <button className="codes-btn-add" onClick={createCode}>
            + Ajouter
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="codes-table-card">
        <h3 className="codes-table-title">
          📋 Liste des Codes ({codes.length})
        </h3>

        {codes.length === 0 ? (
          <div className="codes-empty">
            <span>🔑</span>
            <p>Aucun code enregistré</p>
          </div>
        ) : (
          <table className="codes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Code</th>
                <th>Domaine</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {codes.map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="badge-id">#{c.id}</span>
                  </td>

                  <td>
                    {editId === c.id ? (
                      <input
                        className="codes-input-inline"
                        value={editForm.code}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            code: e.target.value,
                          })
                        }
                        autoFocus
                      />
                    ) : (
                      <span className="code-value">
                        🔑 {c.code}
                      </span>
                    )}
                  </td>

                  <td>
                    {editId === c.id ? (
                      <select
                        className="codes-select-inline"
                        value={editForm.domaineId}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            domaineId: e.target.value,
                          })
                        }
                      >
                        <option value="">Choisir domaine</option>

                        {domaines.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.banqueName})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="code-domaine">
                        🌐 {c.domaine?.name} (
                        {c.domaine?.banque?.name})
                      </span>
                    )}
                  </td>

                  <td>
                    <span
                      className={`code-status ${
                        c.used ? "used" : "available"
                      }`}
                    >
                      {c.used ? "✖ Utilisé" : "✔ Disponible"}
                    </span>
                  </td>

                  <td>
                    <div className="action-btns">
                      {editId === c.id ? (
                        <>
                          <button
                            className="btn-confirm"
                            onClick={() => confirmEdit(c.id)}
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
                            onClick={() => startEdit(c)}
                          >
                            ✏️ Modifier
                          </button>

                          <button
                            className="btn-delete"
                            onClick={() => deleteCode(c.id)}
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