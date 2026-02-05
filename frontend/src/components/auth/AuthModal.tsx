import { useState, SyntheticEvent } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthModalProps {
  onClose: () => void;
}

function AuthModal({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { login, register } = useAuthStore();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.username, formData.email, formData.password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "420px" }}
      >
        <h2 style={{ marginBottom: "var(--spacing-lg)" }}>
          {isLogin ? "🔐 Iniciar Sesión" : "🚀 Registrarse"}
        </h2>

        <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
          {!isLogin && (
            <div style={{ marginBottom: "var(--spacing-lg)" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "var(--spacing-sm)",
                  color: "var(--text-secondary)",
                }}
              >
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={!isLogin}
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
                placeholder="tu_nombre"
              />
            </div>
          )}

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
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <label
              style={{
                display: "block",
                marginBottom: "var(--spacing-sm)",
                color: "var(--text-secondary)",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
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
              placeholder="••••••••"
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
            {loading
              ? "⏳ Cargando..."
              : isLogin
                ? "Iniciar Sesión"
                : "Registrarse"}
          </button>
        </form>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{ color: "var(--neon-cyan)", cursor: "pointer" }}
          >
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
