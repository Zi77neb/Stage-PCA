import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth/change-password.css";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/auth/change-first-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({ password })
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du changement du mot de passe");
      }

      // ✅ UPDATE LOCAL STORAGE
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.firstLogin = false;
        localStorage.setItem("user", JSON.stringify(user));
      }

      setSuccess("Mot de passe changé avec succès");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-page">
      <div className="change-password-card">
        <div className="change-password-icon" aria-hidden="true">🔑</div>

        <h2 className="change-password-title">
          Changement de mot de passe
        </h2>
        
        <p className="change-password-subtitle">
          Pour sécuriser votre compte, veuillez définir un nouveau mot de passe.
        </p>

        {error && (
          <div className="change-password-error" role="alert">
            <span aria-hidden="true">❌</span> {error}
          </div>
        )}

        {success && (
          <div className="change-password-success" role="alert">
            <span aria-hidden="true">✅</span> {success}
          </div>
        )}

        <form className="change-password-form" onSubmit={handleSubmit}>
          <div className="change-password-field">
            <label className="change-password-label" htmlFor="new-password">
              <span aria-hidden="true">🔒</span> Nouveau mot de passe
            </label>
            <input
              id="new-password"
              className="change-password-input"
              type="password"
              placeholder="Entrez votre nouveau mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="change-password-field">
            <label className="change-password-label" htmlFor="confirm-password">
              <span aria-hidden="true">🔄</span> Confirmer le mot de passe
            </label>
            <input
              id="confirm-password"
              className="change-password-input"
              type="password"
              placeholder="Répétez le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className={`change-password-btn ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <span className="change-password-spinner" aria-label="Traitement en cours"></span>
            ) : (
              "Mettre à jour mon mot de passe →"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}