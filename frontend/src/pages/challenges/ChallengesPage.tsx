import ChallengeDetailModal from '@/pages/challenges/components/ChallengeDetailModal'
import CreateChallengeModal from '@/pages/challenges/components/CreateChallengeModal'
import Error from '@/components/share/Error'
import Loading from '@/components/share/Loading'
import { useChallenges } from '@/hooks/useChallenges'
import { useAuthStore } from '@/store/useAuthStore'
import { useMemo, useState } from 'react'

function ChallengesPage() {
  const { user } = useAuthStore()
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null
  )
  const [filters, setFilters] = useState({
    difficulty: 'all',
    sort: 'newest',
  })

  const queryFilters = useMemo(() => filters, [filters])
  const {
    challengesQuery,
    toggleReactionMutation,
    deleteChallengeMutation,
  } = useChallenges(queryFilters, user?.id)

  const challenges = challengesQuery.data ?? []
  const selectedChallenge = selectedChallengeId
    ? challenges.find((challenge) => challenge.id === selectedChallengeId) ??
      null
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
    <section className="pt-32 max-w-7xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl">💻 Retos de la Comunidad</h2>
        <p className="mt-2 text-sm">
          Resuelve desafíos creados por otros estudiantes o sube los tuyos
        </p>
      </div>

      {/* Controls & Filters */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4 p-4 bg-bg-card rounded-2xl border border-white/8">
        <div className="flex gap-4 items-center flex-wrap">
          <select
            className="filter-select"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
            }
          >
            <option value="all">Todas las dificultades</option>
            <option value="easy">🟢 Fácil</option>
            <option value="medium">🟡 Medio</option>
            <option value="hard">🔴 Difícil</option>
          </select>

          <select
            className="filter-select"
            value={filters.sort}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sort: e.target.value }))
            }
          >
            <option value="newest">⏰ Más recientes</option>
            <option value="popularity">🔥 Más populares</option>
          </select>
        </div>

        <button
          className="btn btn-primary shadow-none"
          onClick={() => setShowCreateModal(true)}
        >
          ➕ Crear Reto
        </button>
      </div>

      {/* Challenge List */}
      {challengesQuery.isLoading ? (
        <Loading section="retos" />
      ) : challengesQuery.error ? (
        <Error section="retos" />
      ) : challenges.length === 0 ? (
        <p className="text-center text-text-muted">
          No hay retos aún. ¡Sé el primero en crear uno!
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="glass-card flex flex-col cursor-pointer"
              onClick={() => setSelectedChallengeId(challenge.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColors[challenge.difficulty] || ''}`}
                >
                  {challenge.difficulty.toUpperCase()}
                </span>
                {user && user.id === challenge.authorId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(challenge.id)
                    }}
                    className="bg-transparent border-none cursor-pointer text-base"
                    title="Eliminar reto"
                  >
                    🗑️
                  </button>
                )}
              </div>

              <h3 className="mb-2">{challenge.title}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1 line-clamp-3">
                {challenge.description}
              </p>

              <div className="flex justify-between items-center mt-auto text-sm text-text-muted pt-4 border-t border-white/5">
                <div className="flex items-center gap-2">
                  {challenge.author?.avatarUrl ? (
                    <img
                      src={challenge.author.avatarUrl}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  <span>{challenge.author?.username || 'Anónimo'}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReaction(challenge.id)
                  }}
                  className={`bg-transparent border-none cursor-pointer flex items-center gap-1 transition-transform duration-200 hover:scale-110 ${
                    challenge.reactions?.some((r) => r.userId === user?.id)
                      ? 'text-neon-pink'
                      : 'text-text-muted'
                  }`}
                >
                  ❤️ {challenge._count?.reactions || 0}
                </button>
              </div>
            </div>
          ))}
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

export default ChallengesPage
