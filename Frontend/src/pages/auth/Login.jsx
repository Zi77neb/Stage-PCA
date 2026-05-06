import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth/login.css";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getErrorMessage = (err) => {
    return (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Erreur serveur"
    );
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email et mot de passe obligatoires");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const user = await login(email, password);

      if (!user) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      setUser(user);

      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-logo"></div>

        <h2 className="login-title">Bienvenue</h2>
        <p className="login-subtitle">Connectez-vous à votre espace</p>

        {error && (
          <div className="login-error">
            ❌ {error}
          </div>
        )}

        <div className="login-form">

          <div className="login-field">
            <label className="login-label">📧 Email</label>
            <input
              className="login-input"
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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