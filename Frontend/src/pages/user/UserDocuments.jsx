import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/UserDocuments.css";

export default function UserDocuments() {

  const [documents, setDocuments] = useState([]);
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
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <div className="user-documents">

      <h2>📄 Mes Documents</h2>

      {error && <div className="error-box">❌ {error}</div>}

      {documents.length === 0 ? (
        <p>Aucun document</p>
      ) : (
        <table className="documents-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.title}</td>

                <td>
                  {new Date(doc.date).toLocaleDateString()}
                </td>

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
                    👁 Voir
                  </button>

                  <button
                    onClick={() =>
                      window.open(`/api/user/documents/${doc.id}/download`, "_blank")
                    }
                  >
                    ⬇ Télécharger
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}