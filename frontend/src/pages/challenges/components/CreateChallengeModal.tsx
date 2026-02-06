import { useState, ChangeEvent, FormEvent } from "react";
import { challengeApi } from "@/services/endpoints/challenge";
import { CreateChallengeFormData } from "@/types/challenge";

interface CreateChallengeModalProps {
  onClose: () => void;
  onSave?: () => void;
}

function CreateChallengeModal({ onClose, onSave }: CreateChallengeModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<CreateChallengeFormData>({
    title: "",
    description: "",
    difficulty: "easy",
    initialCode: "// Escribe tu código aquí\n",
    testCases: "[]", // Keeping it as string for textarea input, will parse to JSON
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate JSON
      let parsedTestCases;
      try {
        parsedTestCases = JSON.parse(formData.testCases);
        if (!Array.isArray(parsedTestCases))
          throw new Error("Debe ser un array");
      } catch (err) {
        throw new Error("Los casos de prueba deben ser un JSON válido (Array)");
      }

      await challengeApi.create({
        ...formData,
        testCases: parsedTestCases,
      });
      if (onSave) onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear reto");
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
        style={{ maxWidth: "600px", textAlign: "left" }}
      >
        <h2 style={{ marginBottom: "var(--spacing-xl)", textAlign: "center" }}>
          🚀 Crear Reto
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>Título</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Suma de dos números"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explica qué debe hacer la función..."
              rows={3}
              required
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>Dificultad</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div style={{ marginBottom: "var(--spacing-md)" }}>
            <label style={labelStyle}>Código Inicial</label>
            <textarea
              name="initialCode"
              value={formData.initialCode}
              onChange={handleChange}
              rows={5}
              style={{ ...inputStyle, fontFamily: "monospace" }}
            />
          </div>

          <div style={{ marginBottom: "var(--spacing-xl)" }}>
            <label style={labelStyle}>Casos de Prueba (JSON Array)</label>
            <textarea
              name="testCases"
              value={formData.testCases}
              onChange={handleChange}
              placeholder={'[{"input": [1, 2], "output": 3}]'}
              rows={3}
              style={{ ...inputStyle, fontFamily: "monospace" }}
            />
            <small style={{ color: "var(--text-secondary)" }}>
              Ejemplo: {"[{'input': [1, 2], 'output': 3}]"}
            </small>
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
              {loading ? "⏳ Creando..." : "✨ Crear Reto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateChallengeModal;
