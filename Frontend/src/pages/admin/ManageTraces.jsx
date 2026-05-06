import { useEffect, useState } from "react";
import API from "../../services/api";

export default function ManageTraces() {

  const [traces, setTraces] = useState([]);

  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [filters, setFilters] = useState({
    userId: "",
    documentId: ""
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
      const [tRes, uRes, dRes] = await Promise.all([
        API.get("/admin/traces"),
        API.get("/admin/users"),
        API.get("/admin/documents")
      ]);

      setTraces(normalize(tRes.data));
      setUsers(normalize(uRes.data));
      setDocuments(normalize(dRes.data));

      setError(null);

    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTraces = traces.filter(t => {
    return (
      (!filters.userId || t.userId === Number(filters.userId)) &&
      (!filters.documentId || t.documentId === Number(filters.documentId))
    );
  });

  return (
    <div>

      <h2>📊 Traçabilité</h2>

      {error && <p>{error}</p>}

      <div>
        <select
          value={filters.userId}
          onChange={(e) =>
            setFilters({ ...filters, userId: e.target.value })
          }
        >
          <option value="">Filtrer par user</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>
              {u.username}
            </option>
          ))}
        </select>

        <select
          value={filters.documentId}
          onChange={(e) =>
            setFilters({ ...filters, documentId: e.target.value })
          }
        >
          <option value="">Filtrer par document</option>
          {documents.map(d => (
            <option key={d.id} value={d.id}>
              {d.fileName}
            </option>
          ))}
        </select>
      </div>

      {filteredTraces.length === 0 ? (
        <p>Aucune trace</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Document</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredTraces.map((t) => (
              <tr key={t.id}>
                <td>
                  {users.find(u => u.id === t.userId)?.username || t.userId}
                </td>
                <td>
                  {documents.find(d => d.id === t.documentId)?.fileName || t.documentId}
                </td>
                <td>{t.action}</td>
                <td>
                  {t.actionDate
                    ? new Date(t.actionDate).toLocaleString()
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