import { useChallenges } from '@/hooks/useChallenges'
import { CreateChallengeFormData } from '@/types/challenge'
import { ChangeEvent, FormEvent, useState } from 'react'

interface CreateChallengeModalProps {
  onClose: () => void
  onSave?: () => void
}

const inputClasses =
  'w-full p-4 bg-bg-primary border-2 border-neon-cyan/30 rounded-xl text-text-main text-base outline-none transition-all duration-200 focus:border-neon-cyan focus:shadow-neon-cyan'

function CreateChallengeModal({ onClose, onSave }: CreateChallengeModalProps) {
  const { createChallengeMutation } = useChallenges()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<CreateChallengeFormData>({
    title: '',
    description: '',
    difficulty: 'easy',
    initialCode: '// Escribe tu código aquí\n',
    testCases: '[]',
  })

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let parsedTestCases: string
      try {
        parsedTestCases = JSON.parse(formData.testCases)
        if (!Array.isArray(parsedTestCases))
          throw new Error('Debe ser un array')
      } catch (err) {
        throw new Error('Los casos de prueba deben ser un JSON válido (Array)')
      }

      await createChallengeMutation.mutateAsync({
        ...formData,
        testCases: parsedTestCases,
      })
      if (onSave) onSave()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al crear reto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-[600px] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-8 text-center">🚀 Crear Reto</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              Título
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Suma de dos números"
              required
              className={inputClasses}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Explica qué debe hacer la función..."
              rows={3}
              required
              className={`${inputClasses} resize-y`}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              Dificultad
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className={inputClasses}
            >
              <option value="easy">Fácil</option>
              <option value="medium">Medio</option>
              <option value="hard">Difícil</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              Código Inicial
            </label>
            <textarea
              name="initialCode"
              value={formData.initialCode}
              onChange={handleChange}
              rows={5}
              className={`${inputClasses} font-mono`}
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-text-secondary text-sm">
              Casos de Prueba (JSON Array)
            </label>
            <textarea
              name="testCases"
              value={formData.testCases}
              onChange={handleChange}
              placeholder={'[{"input": [1, 2], "output": 3}]'}
              rows={3}
              className={`${inputClasses} font-mono`}
            />
            <small className="text-text-secondary">
              Ejemplo: {"[{'input': [1, 2], 'output': 3}]"}
            </small>
          </div>

          {error && (
            <div className="p-4 bg-neon-pink/10 border border-neon-pink rounded-xl text-neon-pink mb-6 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              className="btn btn-secondary flex-1"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? '⏳ Creando...' : '✨ Crear Reto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateChallengeModal
