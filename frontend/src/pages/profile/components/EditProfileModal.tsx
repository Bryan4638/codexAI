import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { leaderboardApi } from "@/services/api";

interface EditProfileModalProps {
  onClose: () => void;
  onSave?: () => void; // Made optional as in usage it might not be passed or handled flexibly
}

interface FormData {
  bio: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  isPublic: boolean;
}

function EditProfileModal({ onClose, onSave }: EditProfileModalProps) {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    bio: "",
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
    isPublic: true,
  });

  useEffect(() => {
    // Cargar datos actuales del perfil
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const data = await leaderboardApi.getUserProfile(user.id);
      if (data.profile) {
        // data.profile might contain checks
        setFormData({
          bio: data.profile.bio || "",
          github: data.profile.contact?.github || "",
          linkedin: data.profile.contact?.linkedin || "",
          twitter: data.profile.contact?.twitter || "",
          website: data.profile.contact?.website || "",
          isPublic:
            data.profile.isPublic !== undefined ? data.profile.isPublic : true,
        });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await leaderboardApi.updateProfile(formData);
      if (onSave) onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "var(--spacing-md)",
    background: "var(--bg-primary)",
    border: "2px solid rgba(0, 240, 255, 0.3)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontSize: "1rem",
    outline: "none",
    transition: "var(--transition-fast)",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "var(--spacing-sm)",
    color: "var(--text-secondary)",
    fontSize: "0.9rem",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "500px", textAlign: "left" }}
      >
        <h2 style={{ marginBottom: "var(--spacing-xl)", textAlign: "center" }}>
          ✏️ Editar Perfil
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Bio */}
          <div style={{ marginBottom: "var(--spacing-lg)" }}>
            <label style={labelStyle}>Biografía</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Redes Sociales */}
          <h4
            style={{
              marginBottom: "var(--spacing-md)",
              color: "var(--neon-cyan)",
            }}
          >
            🔗 Redes Sociales
          </h4>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>🐙 GitHub (usuario)</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="tu-usuario-github"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>💼 LinkedIn (usuario)</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="tu-perfil-linkedin"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>𝕏 Twitter (usuario)</label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="tu_usuario"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <label style={labelStyle}>🌐 Sitio Web (URL completa)</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://tu-sitio.com"
              style={inputStyle}
            />
          </div>

          {/* Privacidad */}
          <div
            style={{
              padding: "var(--spacing-lg)",
              background: "rgba(139, 92, 246, 0.1)",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              borderRadius: "var(--radius-md)",
              marginBottom: "var(--spacing-xl)",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--spacing-md)",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                style={{
                  width: "20px",
                  height: "20px",
                  accentColor: "var(--neon-cyan)",
                }}
              />
              <div>
                <div
                  style={{ color: "var(--text-primary)", fontWeight: "600" }}
                >
                  {formData.isPublic
                    ? "🔓 Perfil Público"
                    : "🔒 Perfil Privado"}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  {formData.isPublic
                    ? "Otros usuarios pueden ver tu bio y redes sociales"
                    : "Solo se mostrará tu nombre y medallas"}
                </div>
              </div>
            </label>
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

          <div style={{ display: "flex", gap: "var(--spacing-md)" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? "⏳ Guardando..." : "💾 Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
