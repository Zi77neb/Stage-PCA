import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/UserDocuments.css";

export default function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getErrorMessage = (err) => {
    return err?.response?.data?.message || err?.response?.data?.error || err.message || "Erreur serveur";
  };

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/documents");
      setDocuments(res.data);
      setFilteredDocs(res.data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  useEffect(() => {
    let result = documents;
    if (searchTerm) {
      result = result.filter((doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus === "new") {
      result = result.filter((doc) => !doc.viewed);
    } else if (filterStatus === "viewed") {
      result = result.filter((doc) => doc.viewed);
    }
    setFilteredDocs(result);
  }, [searchTerm, filterStatus, documents]);

  return (
    <div className="user-docs-container">
      {/* ===== HEADER ===== */}
      <div className="user-docs-header">
        <div>
          <h2 className="user-docs-title">Mes Documents</h2>
          <p className="user-docs-subtitle">Consultez et téléchargez vos pièces officielles en toute sécurité</p>
        </div>
        <div className="user-docs-header-badge">
          Vault: {filteredDocs.length} document{filteredDocs.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="user-docs-toolbar">
        <div className="user-search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="user-search-input"
            placeholder="Rechercher par titre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-tabs-group">
          <button 
            className={`filter-tab ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            Tous
          </button>
          <button 
            className={`filter-tab ${filterStatus === "new" ? "active" : ""}`}
            onClick={() => setFilterStatus("new")}
          >
            Nouveaux
          </button>
          <button 
            className={`filter-tab ${filterStatus === "viewed" ? "active" : ""}`}
            onClick={() => setFilterStatus("viewed")}
          >
            Consultés
          </button>
        </div>
      </div>

      {error && (
        <div className="etats-error-box">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* ===== TABLE CARD ===== */}
      <div className="user-docs-card">
        <h3 className="etats-table-title">Votre coffre-fort numérique</h3>

        {loading ? (
          <div className="etats-empty">
            <span className="loading-icon">🔒</span>
            <p>Accès au coffre-fort en cours...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="etats-empty">
            <span>🔍</span>
            <p>Aucun document trouvé</p>
          </div>
        ) : (
          <table className="user-docs-table">
            <thead>
              <tr>
                <th>Titre du document</th>
                <th>Date d'émission</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td><span className="etat-nom">{doc.title}</span></td>
                  <td><span className="etat-code">{new Date(doc.date).toLocaleDateString()}</span></td>
                  <td>
                    {doc.viewed ? (
                      <span className="badge-status viewed">✔ Consulté</span>
                    ) : (
                      <span className="badge-status new">🆕 Nouveau</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="user-action-btns">
                      <button
                        className="btn-user-view"
                        onClick={() => window.open(`/api/user/documents/${doc.id}/view`, "_blank")}
                      >
                        👁 Voir
                      </button>
                      <button
                        className="btn-user-download"
                        onClick={() => window.open(`/api/user/documents/${doc.id}/download`, "_blank")}
                      >
                        ⬇ Télécharger
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