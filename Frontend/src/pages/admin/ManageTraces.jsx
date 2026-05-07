import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageTraces.css";

export default function ManageTraces() {
  const [grouped, setGrouped] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [error, setError] = useState(null);

  const loadTraces = async () => {
    try {
      const res = await API.get("/admin/traces");
      groupData(res.data);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les traces d'activité.");
    }
  };

  useEffect(() => {
    loadTraces();
  }, []);

  const groupData = (data) => {
    const map = {};
    data.forEach(t => {
      const docId = t.document?.id;
      const userId = t.user?.id;
      const action = t.action;

      if (!map[docId]) {
        map[docId] = {
          documentId: docId,
          fileName: t.document?.fileName || "Sans nom",
          viewUsers: new Set(),
          downloadUsers: new Set(),
          users: new Set(),
          detailsMap: {}
        };
      }

      if (action === "VIEW") map[docId].viewUsers.add(userId);
      if (action === "DOWNLOAD") map[docId].downloadUsers.add(userId);
      map[docId].users.add(userId);

      const key = `${userId}_${action}`;
      if (!map[docId].detailsMap[key] || new Date(t.actionDate) > new Date(map[docId].detailsMap[key].actionDate)) {
        map[docId].detailsMap[key] = t;
      }
    });

    const result = Object.values(map).map(d => ({
      ...d,
      views: d.viewUsers.size,
      downloads: d.downloadUsers.size,
      usersCount: d.users.size,
      details: Object.values(d.detailsMap)
    }));

    setGrouped(result);
  };

  return (
    <div className="traces-container">
      {/* ===== HEADER ===== */}
      <div className="traces-header">
        <div>
          <h2 className="traces-title">Suivi des Activités</h2>
          <p className="traces-subtitle">Visualisez les interactions des utilisateurs avec les documents</p>
        </div>
        <div className="traces-header-badge">
          📈 {grouped.length} document{grouped.length > 1 ? "s" : ""} tracés
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="traces-error-box">
          <span>⚠️</span> {error}
          <button className="error-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ===== TABLE CARD ===== */}
      <div className="traces-table-card">
        <h3 className="traces-table-title">Récapitulatif par document</h3>

        <table className="traces-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>👁️ Consultation</th>
              <th>⬇️ Téléchargement</th>
              <th>👥 Total Unique</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map(doc => (
              <tr key={doc.documentId}>
                <td><span className="doc-filename">{doc.fileName}</span></td>
                <td><span className="stats-badge views">{doc.views} users</span></td>
                <td><span className="stats-badge downloads">{doc.downloads} users</span></td>
                <td><span className="domaine-badge">👥 {doc.usersCount}</span></td>
                <td>
                  <button className="btn-edit" onClick={() => setSelectedDoc(doc)}>
                    🔍 Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== MODAL ===== */}
      {selectedDoc && (
        <div className="modal-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">📄 {selectedDoc.fileName}</h3>
              <button className="modal-close" onClick={() => setSelectedDoc(null)}>✕</button>
            </div>

            <div className="modal-body">
              <table className="traces-table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Action</th>
                    <th>Dernière activité</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDoc.details.map((t, idx) => (
                    <tr key={idx}>
                      <td><span className="etat-nom">{t.user?.username}</span></td>
                      <td>
                        <span className={`frequence-badge ${t.action === 'VIEW' ? 'view-bg' : 'down-bg'}`}>
                          {t.action === "VIEW" ? "👁️ Lecture" : "⬇️ Téléchargement"}
                        </span>
                      </td>
                      <td><span className="etat-description">{new Date(t.actionDate).toLocaleString()}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button className="btn-confirm" onClick={() => setSelectedDoc(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}