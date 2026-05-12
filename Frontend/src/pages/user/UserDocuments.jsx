import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/UserDocuments.css";

export default function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const [filterDate, setFilterDate] = useState("");
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

   
    if (filterDate) {
      result = result.filter((doc) => {
        
        const docDateFormatted = new Date(doc.date).toLocaleDateString();
        const selectedDateFormatted = new Date(filterDate).toLocaleDateString();
        return docDateFormatted === selectedDateFormatted;
      });
    }

    
    if (filterStatus === "new") {
      result = result.filter((doc) => !doc.viewed);
    } else if (filterStatus === "viewed") {
      result = result.filter((doc) => doc.viewed);
    }

    setFilteredDocs(result);
  }, [filterDate, filterStatus, documents]);

  const openWithAuth = async (url, isDownload = false) => {
    try {
      const res = await API.get(url, { responseType: "blob" });
      const contentType = res.headers["content-type"] || "application/octet-stream";
      const blob = new Blob([res.data], { type: contentType });
      const fileURL = window.URL.createObjectURL(blob);

      if (isDownload) {
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(fileURL, "_blank");
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  return (
    <div className="user-docs-container">
      <div className="user-docs-header">
        <div>
          <h2 className="user-docs-title">Mes Documents</h2>
          <p className="user-docs-subtitle">
            Consultez et téléchargez vos pièces officielles en toute sécurité
          </p>
        </div>
        <div className="user-docs-header-badge">
          Vault: {filteredDocs.length} document{filteredDocs.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="user-docs-toolbar">
        {/* Barre de recherche remplacée par le filtre Date */}
        <div className="user-search-wrapper">
          <span className="search-icon">📅</span>
          <input
            type="date"
            className="user-search-input"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          {filterDate && (
            <button 
              onClick={() => setFilterDate("")} 
              style={{border: 'none', background: 'transparent', cursor: 'pointer', marginLeft: '-30px', marginRight: '10px'}}
            >
              ✕
            </button>
          )}
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
          ⚠️ {error}
        </div>
      )}

      <div className="user-docs-card">
        <h3 className="etats-table-title">Vos Documents</h3>

        {loading ? (
          <div className="etats-empty">Chargement...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="etats-empty">Aucun document trouvé pour cette sélection</div>
        ) : (
          <table className="user-docs-table">
            <thead>
              <tr>
                <th>Fichier</th>
                <th>Date</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocs.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.fileName}</td>
                  <td>{new Date(doc.date).toLocaleDateString()}</td>
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
  className="btn-view-doc"
  onClick={() => openWithAuth(`/user/documents/${doc.id}/view`)}
>
  👁️ Consulter
</button>

                      <button
                        className="btn-view-doc"
                        onClick={() => openWithAuth(`/user/documents/${doc.id}/download`, true)}
                      >
                         Telecharger
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