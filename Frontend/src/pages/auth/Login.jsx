import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth/login.css";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const user = await login(username, password);

      if (!user || user.error) {
        alert("Login failed");
        return;
      }

      setUser(user);
      navigate("/dashboard");

    } catch (e) {
      console.error(e);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ===== CARTE DE CONNEXION ===== */}
      <div className="login-card">

        {/* Logo / Icône */}
        <div className="login-logo"></div>

        {/* Titre */}
        <h2 className="login-title">Bienvenue</h2>
        <p className="login-subtitle">Connectez-vous à votre espace admin</p>

        {/* Formulaire */}
        <div className="login-form">

          <div className="login-field">
            <label className="login-label">👤 Nom d'utilisateur</label>
            <input
              className="login-input"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div className="login-field">
            <label className="login-label">🔒 Mot de passe</label>
            <input
              className="login-input"
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </div>

          <button
            className={`login-btn ${loading ? "loading" : ""}`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner"></span>
            ) : (
              "Se connecter →"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}