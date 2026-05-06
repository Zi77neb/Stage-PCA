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
    return <div className="dashboard-loading">Chargement...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        ❌ {error}
        <button onClick={loadDocuments}>Réessayer</button>
      </div>
    );
  }

  return (
    <div className="user-dashboard">

      <div className="dashboard-header">
        <h1>📊 Mon Dashboard</h1>
      </div>

      <div className="dashboard-stats">

        <div className="stat-card">
          <span>📄</span>
          <h3>{total}</h3>
          <p>Total documents</p>
        </div>

        <div className="stat-card">
          <span>👁️</span>
          <h3>{viewed}</h3>
          <p>Consultés</p>
        </div>

        <div className="stat-card">
          <span>🆕</span>
          <h3>{notViewed}</h3>
          <p>Non consultés</p>
        </div>

      </div>

      <div className="dashboard-section">

        <div className="section-header">
          <h2>📄 Derniers documents</h2>
          <button onClick={() => navigate("/my-documents")}>
            Voir tout →
          </button>
        </div>

        {documents.length === 0 ? (
          <p>Aucun document</p>
        ) : (
          <table className="documents-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {documents.slice(0, 5).map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.title}</td>
                  <td>{new Date(doc.date).toLocaleDateString()}</td>
                  <td>
                    {doc.viewed ? (
                      <span className="badge viewed">✔ Vu</span>
                    ) : (
                      <span className="badge new">🆕 Nouveau</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        window.open(`/api/user/documents/${doc.id}/view`, "_blank")
                      }
                    >
                      👁️ Voir
                    </button>
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