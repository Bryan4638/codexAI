import CyberSelect from '@/components/share/CustomDropdown'
import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useChallenges } from '@/hooks/useChallenges'
import ChallengeDetailModal from '@/pages/challenges/components/ChallengeDetailModal'
import CreateChallengeModal from '@/pages/challenges/components/CreateChallengeModal'
import { useAuthStore } from '@/store/useAuthStore'
import {
  IconHeart,
  IconLayersIntersect,
  IconPlus,
  IconTrash,
  IconUserFilled,
  IconUsers,
} from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { difficultyOptions, sortOptions } from './data/filterOptions'

export default function ChallengesPage() {
  const { user } = useAuthStore()
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null
  )

  // Unificamos el estado de los filtros aquí
  const [filters, setFilters] = useState({
    difficulty: 'all',
    sort: 'newest',
  })

  const queryFilters = useMemo(() => filters, [filters])
  const { challengesQuery, toggleReactionMutation, deleteChallengeMutation } =
    useChallenges(queryFilters, user?.id)

  const challenges = challengesQuery.data ?? []
  const selectedChallenge = selectedChallengeId
    ? (challenges.find((challenge) => challenge.id === selectedChallengeId) ??
      null)
    : null

  const handleCreateSuccess = () => {
    challengesQuery.refetch()
  }

  const handleReaction = async (id: string) => {
    try {
      await toggleReactionMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error reaccionando:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este reto?'))
      return
    try {
      await deleteChallengeMutation.mutateAsync(id)
    } catch (error) {
      console.error('Error eliminando:', error)
    }
  }

  const difficultyColors: Record<string, string> = {
    easy: 'text-neon-green border-neon-green',
    medium: 'text-neon-cyan border-neon-cyan',
    hard: 'text-neon-pink border-neon-pink',
  }

  return (
    <section className="py-28 max-w-7xl mx-auto px-6">
      <header className="flex items-center justify-center flex-col mb-12">
        <h2 className="text-3xl flex items-center gap-4 text-text-main">
          <IconUsers size={50} /> Retos de la Comunidad
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Resuelve desafíos creados por otros estudiantes o sube los tuyos
        </p>
      </header>

      {/* Controls & Filters */}
      <section className="flex justify-between items-center mb-8 flex-wrap gap-4 p-4 bg-bg-card rounded-2xl border border-white/10 shadow-card">
        <div className="flex gap-4 items-center flex-wrap">
          <CyberSelect
            options={difficultyOptions}
            value={filters.difficulty}
            onChange={(val) =>
              setFilters((prev) => ({ ...prev, difficulty: val }))
            }
          />

          <CyberSelect
            options={sortOptions}
            value={filters.sort}
            onChange={(val) => setFilters((prev) => ({ ...prev, sort: val }))}
          />
        </div>

        <button
          className="btn btn-primary shadow-none"
          onClick={() => setShowCreateModal(true)}
        >
          <IconPlus size={20} /> Crear Reto
        </button>
      </section>

      {/* Challenge List */}
      {challengesQuery.isLoading ? (
        <Loading section="retos" />
      ) : challengesQuery.error ? (
        <Error section="retos" />
      ) : challenges.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-white/5 rounded-2xl bg-bg-secondary/50">
          <IconLayersIntersect size={48} className="text-text-muted mb-4" />
          <p className="text-center text-text-muted">
            No hay retos aún. ¡Sé el primero en crear uno!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {challenges.map((challenge) => {
            return (
              <div
                key={challenge.id}
                className="bg-bg-secondary border border-white/10 rounded-2xl p-5 flex flex-col cursor-pointer transition-all duration-300 hover:border-neon-cyan/50 hover:-translate-y-1 hover:shadow-neon-cyan"
                onClick={() => setSelectedChallengeId(challenge.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs px-3 py-1 mb-4 rounded-full border bg-bg-tertiary ${difficultyColors[challenge.difficulty] || ''}`}
                  >
                    {challenge.difficulty.toUpperCase()}
                  </span>
                  {user && user.username === challenge.author?.username && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(challenge.id)
                      }}
                      className="bg-transparent hover:text-neon-pink transition-colors duration-300 text-text-muted border-none cursor-pointer p-1"
                      title="Eliminar reto"
                    >
                      <IconTrash size={20} />
                    </button>
                  )}
                </div>

                <h3 className="mb-2 text-lg font-display text-text-main group-hover:text-neon-cyan transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-sm text-text-secondary mb-6 flex-1 line-clamp-3">
                  {challenge.description}
                </p>

                <div className="flex justify-between items-center mt-auto text-sm text-text-muted pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {challenge.author?.avatarUrl ? (
                      <img
                        src={challenge.author.avatarUrl}
                        alt=""
                        className="w-7 h-7 rounded-full border border-white/20"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-bg-tertiary flex items-center justify-center border border-white/10">
                        <IconUserFilled size={14} className="text-text-muted" />
                      </div>
                    )}
                    <span className="font-medium">
                      {challenge.author?.username || 'Anónimo'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReaction(challenge.id)
                    }}
                    className={`cursor-pointer flex items-center gap-1.5 transition-all duration-200 hover:scale-110 px-2 py-1 rounded-lg hover:bg-white/5 ${
                      challenge.hasReacted
                        ? 'text-neon-pink'
                        : 'text-text-muted'
                    }`}
                  >
                    <IconHeart
                      size={20}
                      fill={challenge.hasReacted ? 'currentColor' : 'none'}
                    />
                    <span className="font-medium">
                      {challenge.reactionsCount || 0}
                    </span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreateModal && (
        <CreateChallengeModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateSuccess}
        />
      )}

      {selectedChallenge && (
        <ChallengeDetailModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallengeId(null)}
        />
      )}
    </section>
  )
}
