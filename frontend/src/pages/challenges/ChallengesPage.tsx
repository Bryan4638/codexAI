import Footer from '@/components/nav/Footer'
import CyberSelect from '@/components/share/CustomDropdown'
import Error from '@/components/share/Error'
import IsEmpty from '@/components/share/IsEmpty'
import Loading from '@/components/share/Loading'
import { useChallenges } from '@/hooks/useChallenges'
import ChallengeDetailModal from '@/pages/challenges/components/ChallengeDetailModal'
import CreateChallengeModal from '@/pages/challenges/components/CreateChallengeModal'
import { useAuthStore } from '@/store/useAuthStore'
import { IconPlus, IconUsers } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { ChallengeCard } from './components/ChallengeCard'
import {
  difficultyOptions,
  sortOptions,
  statusOptions,
} from './data/filterOptions'

export default function ChallengesPage() {
  const { user } = useAuthStore()
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null
  )

  // Filters state
  const [filters, setFilters] = useState({
    difficulty: 'all',
    sort: 'newest',
    completed: 'all',
    page: 1,
  })

  const queryFilters = useMemo(() => filters, [filters])
  const { challengesQuery, toggleReactionMutation, deleteChallengeMutation } =
    useChallenges(queryFilters, user?.id)

  const challenges = challengesQuery.data?.data ?? []
  const meta = challengesQuery.data?.meta
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

  return (
    <>
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
                setFilters((prev) => ({ ...prev, difficulty: val, page: 1 }))
              }
            />

            <CyberSelect
              options={statusOptions}
              value={filters.completed}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, completed: val, page: 1 }))
              }
            />

            <CyberSelect
              options={sortOptions}
              value={filters.sort}
              onChange={(val) =>
                setFilters((prev) => ({ ...prev, sort: val, page: 1 }))
              }
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
          <IsEmpty text="No hay retos aún. ¡Sé el primero en crear uno!" />
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {challenges.map((challenge) => {
                return (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    currentUser={user!}
                    onDelete={() => handleDelete(challenge.id)}
                    onReaction={() => handleReaction(challenge.id)}
                    onSelect={setSelectedChallengeId}
                  />
                )
              })}
            </div>

            {/* Pagination Controls */}
            {meta && meta.lastPage > 1 && (
              <div className="w-full mt-12 mb-6">
                <div className="flex justify-between items-center bg-bg-card p-4 rounded-2xl border border-white/10 shadow-card">
                  <button
                    className="btn btn-secondary shadow-none px-6"
                    disabled={filters.page === 1}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                    }
                  >
                    Anterior
                  </button>
                  <div className="text-text-secondary">
                    Página{' '}
                    <span className="text-neon-cyan font-bold">
                      {meta.page}
                    </span>{' '}
                    de {meta.lastPage}
                  </div>
                  <button
                    className="btn btn-secondary shadow-none px-6"
                    disabled={filters.page >= meta.lastPage}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                    }
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </>
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
      <Footer />
    </>
  )
}
