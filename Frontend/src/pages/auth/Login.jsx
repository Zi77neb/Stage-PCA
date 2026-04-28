import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth/login.css";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔥 CHANGÉ username → email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // 🔥 ENVOI EMAIL
      const user = await login(email, password);

      if (!user || user.error) {
        alert("Email ou mot de passe incorrect");
        return;
      }

      setUser(user);

      // 🔥 OPTION (rediriger selon rôle)
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }

    } catch (e) {
      console.error(e);
      alert("Erreur serveur");
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

        <div className="login-form">

          {/* 🔥 EMAIL */}
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

          {/* 🔒 PASSWORD */}
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