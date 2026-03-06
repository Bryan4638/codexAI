import Footer from '@/components/nav/Footer'
import CyberSelect from '@/components/share/CyberSelect'
import Error from '@/components/share/Error'
import IsEmpty from '@/components/share/IsEmpty'
import PageHeader from '@/components/share/PageHeader'
import SkeletonCard from '@/components/share/skeletons/SkeletonCard'
import { useChallenges } from '@/hooks/useChallenges'
import { ChallengeCard } from '@/pages/challenges/components/ChallengeCard'
import ChallengeDetailModal from '@/pages/challenges/components/ChallengeDetailModal'
import CreateChallengeModal from '@/pages/challenges/components/CreateChallengeModal'
import {
  difficultyOptions,
  sortOptions,
  statusOptions,
} from '@/pages/challenges/data/filterOptions'
import { useAuthStore } from '@/store/useAuthStore'
import { IconPlus } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

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
    limit: 21,
  })

  const queryFilters = useMemo(() => filters, [filters])
  const { getChallenges, toggleReactionMutation, deleteChallengeMutation } =
    useChallenges(queryFilters, user?.id)

  const challenges = getChallenges.data?.data ?? []
  const meta = getChallenges.data?.meta
  const selectedChallenge = selectedChallengeId
    ? (challenges.find((challenge) => challenge.id === selectedChallengeId) ??
      null)
    : null

  const handleCreateSuccess = () => {
    getChallenges.refetch()
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
        <PageHeader
          title="Retos de la Comunidad"
          subtitle="Resuelve desafíos creados por otros estudiantes o sube los tuyos"
        />
        {/* Controls & Filters */}
        <section className="flex justify-between items-start mb-8 flex-col sm:flex-row flex-wrap gap-4 p-4 bg-bg-card rounded-2xl border border-white/10 shadow-card">
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

          {user && (
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <IconPlus size={20} /> Crear Reto
            </button>
          )}
        </section>

        {/* Challenge List */}
        {getChallenges.isLoading ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>
        ) : getChallenges.error ? (
          <Error section="retos" />
        ) : challenges.length === 0 ? (
          <IsEmpty text="No hay retos aún. ¡Sé el primero en crear uno!" />
        ) : (
          <>
            <main className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
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
            </main>

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
                <div className="text-text-secondary flex justify-end gap-1.5 p-4">
                  Página{' '}
                  <span className="text-neon-cyan font-bold">{meta.page}</span>{' '}
                  de {meta.lastPage}
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
