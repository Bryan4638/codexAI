import { challengeApi } from '@/services/endpoints/challenges'
import { useChallengesFiltersStore } from '@/store/useChallengesFiltersStore'
import {
  Challenge,
  CreateChallengeFormData,
  PaginatedChallenges,
} from '@/types/challenge'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useChallenges = (userId?: string) => {
  const queryClient = useQueryClient()
  const {
    getAll,
    create,
    toggleReaction,
    delete: deleteChallenge,
  } = challengeApi
  const { completed, difficulty, sort, limit } = useChallengesFiltersStore()
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [completed, difficulty, sort, limit])

  const getChallenges = useQuery({
    queryKey: ['challenges', completed, difficulty, sort, page],
    queryFn: () => getAll({ difficulty, sort, completed, page, limit }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: page === 1 ? undefined : keepPreviousData,
  })

  const meta = getChallenges.data?.meta

  const nextPage = () => {
    if (!meta) return
    if (page < meta?.lastPage) {
      setPage((prev) => prev + 1)
    }
  }

  const previousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1)
    }
  }

  const updateChallengesCache = (
    updater: (items: Challenge[]) => Challenge[]
  ) => {
    const queries = queryClient.getQueriesData<PaginatedChallenges>({
      queryKey: ['challenges'],
    })
    queries.forEach(([key, data]) => {
      if (!data) return
      queryClient.setQueryData(key, {
        ...data,
        data: updater(data.data),
      })
    })
  }

  const createChallengeMutation = useMutation({
    mutationFn: (data: CreateChallengeFormData) => create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] })
    },
  })

  const toggleReactionMutation = useMutation({
    mutationFn: (id: string) => toggleReaction(id),
    onSuccess: (data, id) => {
      const isLiked = typeof data?.liked === 'boolean' ? data.liked : null
      if (!userId || isLiked === null) {
        queryClient.invalidateQueries({ queryKey: ['challenges'] })
        return
      }

      updateChallengesCache((items) =>
        items.map((challenge) => {
          if (challenge.id !== id) return challenge

          const currentCount = challenge.reactionsCount ?? 0
          const nextCount = isLiked
            ? currentCount + (challenge.hasReacted ? 0 : 1)
            : Math.max(currentCount - (challenge.hasReacted ? 1 : 0), 0)

          return {
            ...challenge,
            reactionsCount: nextCount,
            hasReacted: isLiked,
          }
        })
      )
    },
  })

  const deleteChallengeMutation = useMutation({
    mutationFn: (id: string) => deleteChallenge(id),
    onSuccess: (_data, id) => {
      updateChallengesCache((items) =>
        items.filter((challenge) => challenge.id !== id)
      )
    },
  })

  return {
    getChallenges,
    page,
    totalPages: meta?.lastPage ?? 1,
    nextPage,
    previousPage,
    canNext: page < (meta?.lastPage ?? 1),
    canPrevious: page > 1,
    createChallengeMutation,
    toggleReactionMutation,
    deleteChallengeMutation,
  }
}
