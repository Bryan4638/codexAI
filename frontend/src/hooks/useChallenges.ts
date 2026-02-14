import { challengeApi } from '@/services/endpoints/challenges'
import { Challenge, CreateChallengeFormData } from '@/types/challenge'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useChallenges = (
  filters?: Record<string, any>,
  userId?: string
) => {
  const queryClient = useQueryClient()
  const { getAll, create, toggleReaction, delete: deleteChallenge } =
    challengeApi

  const challengesQuery = useQuery({
    queryKey: ['challenges', filters],
    queryFn: () => getAll(filters ?? {}),
    enabled: Boolean(filters),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })

  const updateChallengesCache = (
    updater: (items: Challenge[]) => Challenge[]
  ) => {
    const queries = queryClient.getQueriesData<Challenge[]>({
      queryKey: ['challenges'],
    })
    queries.forEach(([key, data]) => {
      if (!data) return
      queryClient.setQueryData(key, updater(data))
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
          const reactions = challenge.reactions ?? []
          const hasLiked = reactions.some((r) => r.userId === userId)
          const nextReactions = isLiked
            ? hasLiked
              ? reactions
              : [...reactions, { userId }]
            : reactions.filter((r) => r.userId !== userId)

          const currentCount = challenge._count?.reactions ?? 0
          const nextCount = isLiked
            ? currentCount + (hasLiked ? 0 : 1)
            : Math.max(currentCount - (hasLiked ? 1 : 0), 0)

          return {
            ...challenge,
            reactions: nextReactions,
            _count: {
              ...challenge._count,
              reactions: nextCount,
            },
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
    challengesQuery,
    createChallengeMutation,
    toggleReactionMutation,
    deleteChallengeMutation,
  }
}
