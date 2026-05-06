import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ManageDocuments() {

  const [documents, setDocuments] = useState([]);

  const [banques, setBanques] = useState([]);
  const [domaines, setDomaines] = useState([]);
  const [etats, setEtats] = useState([]);

  const [filters, setFilters] = useState({
    banqueId: "",
    domaineId: "",
    etatId: ""
  });

  const [error, setError] = useState(null);

  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Erreur serveur"
    );
  };

  const normalize = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    return [];
  };

  const loadData = async () => {
    try {
      const [docRes, bRes, dRes, eRes] = await Promise.all([
        API.get("/admin/documents"),
        API.get("/admin/banques"),
        API.get("/admin/domaines"),
        API.get("/admin/etats")
      ]);

      setDocuments(normalize(docRes.data));
      setBanques(normalize(bRes.data));
      setDomaines(normalize(dRes.data));
      setEtats(normalize(eRes.data));

      setError(null);

    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredDocuments = documents.filter(d => {
    return (
      (!filters.banqueId || d.banque?.id === Number(filters.banqueId)) &&
      (!filters.domaineId || d.domaine?.id === Number(filters.domaineId)) &&
      (!filters.etatId || d.etat?.id === Number(filters.etatId))
    );
  });

  return (
    <div>

      <h2>📄 Documents</h2>

      {error && <p>{error}</p>}

      <div>
        <select
          value={filters.banqueId}
          onChange={(e) =>
            setFilters({ ...filters, banqueId: e.target.value })
          }
        >
          <option value="">Banque</option>
          {banques.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          value={filters.domaineId}
          onChange={(e) =>
            setFilters({ ...filters, domaineId: e.target.value })
          }
        >
          <option value="">Domaine</option>
          {domaines.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <select
          value={filters.etatId}
          onChange={(e) =>
            setFilters({ ...filters, etatId: e.target.value })
          }
        >
          <option value="">État</option>
          {etats.map(e => (
            <option key={e.id} value={e.id}>{e.nom}</option>
          ))}
        </select>
      </div>

      {filteredDocuments.length === 0 ? (
        <p>Aucun document</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Fichier</th>
              <th>Banque</th>
              <th>Domaine</th>
              <th>État</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredDocuments.map((d) => (
              <tr key={d.id}>
                <td>{d.fileName}</td>
                <td>{d.banque?.name}</td>
                <td>{d.domaine?.name}</td>
                <td>{d.etat?.nom}</td>
                <td>
                  {d.dateDocument
                    ? new Date(d.dateDocument).toLocaleDateString()
                    : "-"
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}