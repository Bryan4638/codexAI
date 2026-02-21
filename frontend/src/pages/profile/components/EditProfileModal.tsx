import { leaderboardApi } from '@/services/endpoints/leaderboard'
import { useAuthStore } from '@/store/useAuthStore'
import { ProfileFormData } from '@/types/profile'
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconDeviceFloppy,
  IconHourglass,
  IconLink,
  IconLock,
  IconLockOpen,
  IconPencilCode,
  IconWorld,
} from '@tabler/icons-react'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

interface EditProfileModalProps {
  onClose: () => void
  onSave?: () => void
}

const inputClasses =
  'w-full p-4 bg-bg-primary border-2 border-neon-cyan/30 rounded-xl text-text-main text-base outline-none transition-all duration-200 focus:border-neon-cyan focus:shadow-neon-cyan'

function EditProfileModal({ onClose, onSave }: EditProfileModalProps) {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState<ProfileFormData>({
    bio: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    isPublic: true,
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    try {
      const data = await leaderboardApi.getUserProfile(user.id)
      if (data.profile) {
        setFormData({
          bio: data.profile.bio || '',
          github: data.profile.contact?.github || '',
          linkedin: data.profile.contact?.linkedin || '',
          twitter: data.profile.contact?.twitter || '',
          website: data.profile.contact?.website || '',
          isPublic:
            data.profile.isPublic !== undefined ? data.profile.isPublic : true,
        })
      }
    } catch (error) {
      console.error('Error cargando perfil:', error)
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await leaderboardApi.updateProfile(formData)
      if (onSave) onSave()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal max-w-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-8 text-center flex items-center justify-center gap-2">
          <IconPencilCode /> Editar Perfil
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Bio */}
          <div className="mb-6">
            <label className="block mb-2 text-text-secondary text-sm">
              Biografía
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              className={`${inputClasses} resize-y`}
            />
          </div>

          {/* Social Links */}
          <h4 className="mb-4 text-neon-cyan flex items-center gap-2">
            <IconLink size={18} /> Redes Sociales
          </h4>

          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              <span className="inline-flex items-center gap-2">
                <IconBrandGithub size={16} /> GitHub (usuario)
              </span>
            </label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="tu-usuario-github"
              className={inputClasses}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              <span className="inline-flex items-center gap-2">
                <IconBrandLinkedin size={16} /> LinkedIn (usuario)
              </span>
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="tu-perfil-linkedin"
              className={inputClasses}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-text-secondary text-sm">
              <span className="inline-flex items-center gap-2">
                <IconBrandTwitter size={16} /> Twitter (usuario)
              </span>
            </label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="tu_usuario"
              className={inputClasses}
            />
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-text-secondary text-sm">
              <span className="inline-flex items-center gap-2">
                <IconWorld size={16} /> Sitio Web (URL completa)
              </span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://tu-sitio.com"
              className={inputClasses}
            />
          </div>

          {/* Privacy */}
          <div className="p-6 bg-neon-purple/10 border border-neon-purple/30 rounded-xl mb-8">
            <label className="flex items-center gap-4 cursor-pointer">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-5 h-5 accent-neon-cyan"
              />
              <div>
                <div className="font-semibold flex items-center gap-2">
                  {formData.isPublic ? (
                    <IconLockOpen size={18} />
                  ) : (
                    <IconLock size={18} />
                  )}
                  {formData.isPublic ? 'Perfil Público' : 'Perfil Privado'}
                </div>
                <div className="text-sm text-text-secondary">
                  {formData.isPublic
                    ? 'Otros usuarios pueden ver tu bio y redes sociales'
                    : 'Solo se mostrará tu nombre y medallas'}
                </div>
              </div>
            </label>
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <IconHourglass size={18} /> Guardando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <IconDeviceFloppy size={18} /> Guardar
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
