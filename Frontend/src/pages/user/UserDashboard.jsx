import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "../../styles/UserDashboard.css";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Erreur serveur"
    );
  };

  const loadDocuments = async () => {
    try {
      const res = await API.get("/user/documents");
      setDocuments(res.data);
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

  const total = documents.length;
  const viewed = documents.filter(d => d.viewed).length;
  const notViewed = total - viewed;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner"></div>
        <p>Chargement de votre espace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error-container">
        <div className="dashboard-error-box">
          <span>⚠️</span>
          <h2>Une erreur est survenue</h2>
          <p>{error}</p>
          <button className="btn-retry" onClick={loadDocuments}>🔄 Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Mon Espace Client</h1>
          <p className="dashboard-subtitle">Gérez vos documents et suivez votre activité</p>
        </div>
        <div className="dashboard-date">
          📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon total">📄</div>
          <div className="stat-info">
            <span className="stat-number">{total}</span>
            <span className="stat-label">Total documents</span>
          </div>
        </div>

        <div className="stat-card viewed">
          <div className="stat-icon viewed">👁️</div>
          <div className="stat-info">
            <span className="stat-number">{viewed}</span>
            <span className="stat-label">Consultés</span>
          </div>
        </div>

        <div className="stat-card new">
          <div className="stat-icon new">🆕</div>
          <div className="stat-info">
            <span className="stat-number">{notViewed}</span>
            <span className="stat-label">Non consultés</span>
          </div>
        </div>
      </div>

      <div className="dashboard-section-card">
        <div className="section-header">
          <h3 className="section-title">📄 Derniers documents</h3>
          <button className="card-link" onClick={() => navigate("/my-documents")}>
            Voir tout l'historique →
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="empty-state">
            <span>📁</span>
            <p>Vous n'avez aucun document pour le moment.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Fichier</th>
                 
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {documents.slice(0, 5).map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.fileName}</td>
                    
                    <td>{new Date(doc.date).toLocaleDateString()}</td>

                    <td>
                      {doc.viewed ? (
                        <span className="badge viewed">✔ Consulté</span>
                      ) : (
                        <span className="badge new">🆕 Nouveau</span>
                      )}
                    </td>

                    <td>
                      <button
                        className="btn-view-doc"
                        onClick={() =>
                          window.open(`http://localhost:8080/api/user/documents/${doc.id}/view`, "_blank")
                        }
                      >
                        👁️ Consulter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}