import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/ManageDocument.css";

export default function ManageDocuments() {
  const [documents, setDocuments] = useState([]);
  const [etats, setEtats] = useState([]);
  const [filters, setFilters] = useState({ etatId: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getErrorMessage = (err) => {
    return err?.response?.data?.message || err?.response?.data?.error || err.message || "Erreur serveur";
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
      const [docRes, eRes] = await Promise.all([
        API.get("/documents"),
        API.get("/admin/etats")
      ]);
      setDocuments(normalize(docRes.data));
      setEtats(normalize(eRes.data));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDocuments = documents.filter(d => {
    return (!filters.etatId || d.etat?.id === Number(filters.etatId));
  });

  const handleViewDocument = (doc) => {
    window.open(`http://localhost:8080/api/documents/admin/${doc.id}/view`, "_blank");
  };

  const handleDownloadDocument = (doc) => {
    window.open(`http://localhost:8080/api/documents/admin/${doc.id}/download`, "_blank");
  };

  return (
    <div className="manage-docs-container">
      {/* ===== HEADER ===== */}
      <div className="manage-docs-header">
        <div>
          <h2 className="manage-docs-title">Archives des Documents</h2>
          <p className="manage-docs-subtitle">
            Visualisation et filtrage de l'ensemble des fichiers du système
          </p>
        </div>
        <div className="manage-docs-header-badge">
          📁 {filteredDocuments.length} Fichier{filteredDocuments.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ===== ERROR ===== */}
      {error && (
        <div className="etats-error-box">
          <span>⚠️</span> {error}
          <button className="error-close" onClick={() => setError(null)}>✕</button>
        </div>
      )}

      {/* ===== TOOLBAR ===== */}
      <div className="manage-docs-toolbar">
        <div className="filter-wrapper">
          <label className="filter-label">Filtrer par État :</label>
          <select
            className="manage-docs-select"
            value={filters.etatId}
            onChange={(e) => setFilters({ ...filters, etatId: e.target.value })}
          >
            <option value="">Tous les États</option>
            {etats.map(e => (
              <option key={e.id} value={e.id}>📋 {e.nom}</option>
            ))}
          </select>
        </div>

        <button className="btn-refresh-docs" onClick={loadData}>
          <span>🔄</span> Actualiser la liste
        </button>
      </div>

      {/* ===== TABLE CARD ===== */}
      <div className="manage-docs-card">
        <h3 className="etats-table-title">Registre des fichiers archivés</h3>

        {loading ? (
          <div className="etats-empty">
            <span className="loading-icon">⏳</span>
            <p>Chargement des documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="etats-empty">
            <span>📂</span>
            <p>Aucun document ne correspond à ce filtre</p>
          </div>
        ) : (
          <table className="manage-docs-table">
            <thead>
              <tr>
                <th>Nom du Fichier</th>
                <th>Type / État</th>
                <th>Domaine</th>
                <th>Date d'import</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.map((d) => (
                <tr key={d.id}>
                  <td className="doc-name-cell">
                    <span className="etat-nom">{d.fileName}</span>
                  </td>
                  <td>
                    <span className="frequence-badge">📋 {d.etat?.nom || "Non classé"}</span>
                  </td>
                  <td>
                    <span className="domaine-badge">🌐 {d.etat?.domaine?.name || "N/A"}</span>
                  </td>
                  <td>
                    <span className="etat-code">{new Date(d.dateDocument).toLocaleDateString()}</span>
                  </td>
                  <td className="text-center">
                    <div className="action-buttons">
                      <button
                        className="btn-action-view"
                        onClick={() => handleViewDocument(d)}
                        title="Consulter"
                      >
                        👁️
                      </button>
                      <button
                        className="btn-action-download"
                        onClick={() => handleDownloadDocument(d)}
                        title="Télécharger"
                      >
                        ⬇️
                      </button>
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