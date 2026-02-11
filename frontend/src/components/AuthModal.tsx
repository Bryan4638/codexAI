import { useState, SyntheticEvent } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { authApi } from "../services/api";

interface AuthModalProps {
  onClose: () => void;
}

function AuthModal({ onClose }: AuthModalProps) {
  const { authStep, authEmail, requestCode, verifyCode, resetAuthFlow } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleRequestCode = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await requestCode(email);
      setSuccessMsg("📧 Código enviado a tu email");
    } catch (err: any) {
      setError(err.message || "Error al enviar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await verifyCode(authEmail, code);
      onClose();
    } catch (err: any) {
      setError(err.message || "Código inválido o expirado");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    resetAuthFlow();
    setCode("");
    setError("");
    setSuccessMsg("");
  };

  const handleClose = () => {
    resetAuthFlow();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px" }}
      >
        <h2 style={{ marginBottom: "var(--spacing-lg)" }}>
          {authStep === "email" ? "🔐 Iniciar Sesión" : "📬 Verificar Código"}
        </h2>

        {authStep === "email" ? (
          /* ─── PASO 1: Ingresar email ─── */
          <>
            <form onSubmit={handleRequestCode} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "var(--spacing-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md)",
                    background: "var(--bg-primary)",
                    border: "2px solid rgba(0, 240, 255, 0.3)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    outline: "none",
                  }}
                  placeholder="tu@email.com"
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    background: "rgba(255, 45, 146, 0.1)",
                    border: "1px solid var(--neon-pink)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--neon-pink)",
                    marginBottom: "var(--spacing-lg)",
                    fontSize: "0.9rem",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%", marginBottom: "var(--spacing-lg)" }}
              >
                {loading ? "⏳ Enviando..." : "Enviar Código"}
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-md)",
                margin: "var(--spacing-md) 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <span
                style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}
              >
                o continúa con
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                }}
              />
            </div>

            {/* OAuth buttons */}
            <div
              style={{
                display: "flex",
                gap: "var(--spacing-md)",
                marginTop: "var(--spacing-md)",
              }}
            >
              <a
                href={authApi.getGoogleAuthUrl()}
                className="btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--spacing-sm)",
                  padding: "var(--spacing-md)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "var(--transition-normal)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </a>

              <a
                href={authApi.getGithubAuthUrl()}
                className="btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--spacing-sm)",
                  padding: "var(--spacing-md)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "var(--transition-normal)",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </>
        ) : (
          /* ─── PASO 2: Ingresar código OTP ─── */
          <>
            {successMsg && (
              <div
                style={{
                  padding: "var(--spacing-md)",
                  background: "rgba(0, 255, 136, 0.1)",
                  border: "1px solid var(--neon-green)",
                  borderRadius: "var(--radius-md)",
                  color: "var(--neon-green)",
                  marginBottom: "var(--spacing-lg)",
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                {successMsg}
              </div>
            )}

            <p
              style={{
                color: "var(--text-secondary)",
                marginBottom: "var(--spacing-lg)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              Ingresa el código enviado a{" "}
              <strong style={{ color: "var(--neon-cyan)" }}>
                {authEmail}
              </strong>
            </p>

            <form onSubmit={handleVerifyCode} style={{ textAlign: "left" }}>
              <div style={{ marginBottom: "var(--spacing-lg)" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "var(--spacing-sm)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Código de verificación
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  maxLength={6}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "var(--spacing-md)",
                    background: "var(--bg-primary)",
                    border: "2px solid rgba(0, 240, 255, 0.3)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--text-primary)",
                    fontSize: "1.5rem",
                    letterSpacing: "0.5em",
                    textAlign: "center",
                    outline: "none",
                  }}
                  placeholder="000000"
                />
              </div>

              {error && (
                <div
                  style={{
                    padding: "var(--spacing-md)",
                    background: "rgba(255, 45, 146, 0.1)",
                    border: "1px solid var(--neon-pink)",
                    borderRadius: "var(--radius-md)",
                    color: "var(--neon-pink)",
                    marginBottom: "var(--spacing-lg)",
                    fontSize: "0.9rem",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%", marginBottom: "var(--spacing-md)" }}
              >
                {loading ? "⏳ Verificando..." : "Verificar Código"}
              </button>
            </form>

            <button
              onClick={handleBack}
              style={{
                width: "100%",
                padding: "var(--spacing-md)",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ← Cambiar email
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
