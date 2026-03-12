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
import { useChallengesFiltersStore } from '@/store/useChallengesFiltersStore'
import { IconBolt, IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChallengesPage() {
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(
    null
  )
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { completed, difficulty, sort, setFilters } =
    useChallengesFiltersStore()

  const {
    challengesQuery,
    toggleReactionMutation,
    deleteChallengeMutation,
    canNext,
    canPrevious,
    nextPage,
    previousPage,
    totalPages,
    page,
  } = useChallenges(user?.id)

  const { data, isPending, isError, isFetching, refetch } = challengesQuery

  const challenges = data?.data ?? []

  const selectedChallenge = selectedChallengeId
    ? (challenges.find((challenge) => challenge.id === selectedChallengeId) ??
      null)
    : null

  const handleCreateSuccess = () => {
    refetch()
    setShowCreateModal(false)
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
      refetch()
    } catch (error) {
      console.error('Error eliminando:', error)
    }
  }

  const goToNextPage = () => {
    if (canNext && !isFetching) {
      nextPage()
    }
  }

  const goToPrevPage = () => {
    if (canPrevious && !isFetching) {
      previousPage()
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
              value={difficulty}
              onChange={(val) =>
                setFilters({
                  difficulty: val as 'all' | 'easy' | 'medium' | 'hard',
                })
              }
            />
            <CyberSelect
              options={statusOptions}
              value={completed}
              onChange={(val) =>
                setFilters({
                  completed: val as 'all' | 'completed' | 'pending',
                })
              }
            />
            <CyberSelect
              options={sortOptions}
              value={sort}
              onChange={(val) =>
                setFilters({ sort: val as 'newest' | 'popularity' })
              }
            />
          </div>

          {user && (
            <div className="flex gap-3">
              <button
                className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-neon-cyan/80 to-neon-pink/80 text-black border-none font-bold"
                onClick={() => navigate('/challenges/live-coding')}
              >
                <IconBolt size={20} /> Live Coding
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowCreateModal(true)}
              >
                <IconPlus size={20} /> Crear Reto
              </button>
            </div>
          )}
        </section>

        {/* Challenge List */}
        {isPending ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </section>
        ) : isError ? (
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
            {totalPages > 1 && (
              <div className="w-full mt-12 mb-6">
                <div className="flex justify-between items-center bg-bg-card p-4 rounded-2xl border border-white/10 shadow-card">
                  <button
                    className="btn btn-secondary shadow-none px-6"
                    disabled={!canPrevious || isFetching}
                    onClick={goToPrevPage}
                  >
                    Anterior
                  </button>
                  <button
                    className="btn btn-secondary shadow-none px-6"
                    disabled={!canNext || isFetching}
                    onClick={goToNextPage}
                  >
                    Siguiente
                  </button>
                </div>
                <div className="text-text-secondary flex justify-end gap-1.5 p-4">
                  Página{' '}
                  <span className="text-neon-cyan font-bold">{page}</span> de{' '}
                  {totalPages}
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
