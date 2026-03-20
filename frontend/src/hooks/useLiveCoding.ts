import { challengeApi } from '@/services/endpoints/challenges'
import type {
  LiveCodingResult,
  LiveCodingSessionResponse,
} from '@/types/challenge'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sileo } from 'sileo'

const TAB_PENALTY = 15
const COPY_PASTE_PENALTY = 25

export function useLiveCoding() {
  const [session, setSession] = useState<LiveCodingSessionResponse | null>(null)
  const [result, setResult] = useState<LiveCodingResult | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCanceling, setIsCanceling] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [copyPasteCount, setCopyPasteCount] = useState(0)
  const [code, setCode] = useState('')

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isActiveRef = useRef(false)

  // ── Timer ─────────────────────────────────────────
  useEffect(() => {
    if (session && !result) {
      isActiveRef.current = true
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [session, result])

  // ── Tab Switch Detection ──────────────────────────
  useEffect(() => {
    if (!session || result) return

    const handleVisibility = () => {
      if (document.hidden && isActiveRef.current) {
        setTabSwitches((prev) => {
          const newVal = prev + 1
          sileo.warning({
            title: `Cambio de pestaña detectado (-${TAB_PENALTY} pts)`,
          })
          return newVal
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility)
  }, [session, result])

  // ── Copy/Paste Detection ──────────────────────────
  const handleCopyPaste = useCallback(() => {
    if (!session || result) return

    setCopyPasteCount((prev) => {
      const newVal = prev + 1
      sileo.warning({
        title: `Pegado de código detectado (-${COPY_PASTE_PENALTY} pts)`,
      })
      return newVal
    })
  }, [session, result])

  useEffect(() => {
    if (!session || result) return

    document.addEventListener('paste', handleCopyPaste)
    document.addEventListener('copy', handleCopyPaste)
    return () => {
      document.removeEventListener('paste', handleCopyPaste)
      document.removeEventListener('copy', handleCopyPaste)
    }
  }, [session, result, handleCopyPaste])

  // ── Auto Sync ─────────────────────────────────────
  useEffect(() => {
    if (!session || result || isSubmitting || isCanceling) return

    const syncTimeout = setTimeout(() => {
      challengeApi
        .syncLiveCoding({
          sessionId: session.sessionId,
          code,
          tabSwitches,
          copyPasteCount,
        })
        .catch((err) => console.error('Error syncing live coding:', err))
    }, 2000)

    return () => clearTimeout(syncTimeout)
  }, [code, tabSwitches, copyPasteCount, session, result, isSubmitting, isCanceling])

  // ── Actions ───────────────────────────────────────
  const startSession = async (difficulty?: string) => {
    setIsStarting(true)
    setResult(null)
    setElapsedSeconds(0)
    setTabSwitches(0)
    setCopyPasteCount(0)

    try {
      const res = await challengeApi.startLiveCoding(difficulty)
      setSession(res)
      setElapsedSeconds(res.elapsedSeconds || 0)
      setTabSwitches(res.tabSwitches || 0)
      setCopyPasteCount(res.copyPasteCount || 0)
      setCode(res.code || res.challenge.initialCode || '')
    } catch (error: any) {
      sileo.error({
        title: error?.message || 'Error',
      })
    } finally {
      setIsStarting(false)
    }
  }

  const cancelSession = async () => {
    if (!session || isCanceling || isSubmitting) return

    setIsCanceling(true)
    try {
      await challengeApi.cancelLiveCoding()
      resetSession()
      sileo.success({
        title: 'Sesión cancelada',
        duration: 3000,
      })
    } catch (error: any) {
      sileo.error({
        title: 'Error al cancelar',
        description: error?.message || 'No se pudo cancelar la sesión',
      })
    } finally {
      setIsCanceling(false)
    }
  }

  const submitSolution = async () => {
    if (!session || isSubmitting) return

    setIsSubmitting(true)

    try {
      const res = await challengeApi.submitLiveCoding({
        sessionId: session.sessionId,
        code,
        language: 'javascript',
        tabSwitches,
        copyPasteCount,
      })

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      isActiveRef.current = false

      setResult(res)
    } catch (error: any) {
      sileo.error({
        title: 'Error al enviar',
        description: error?.message || 'No se pudo enviar la solución',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    isActiveRef.current = false
    setSession(null)
    setResult(null)
    setElapsedSeconds(0)
    setTabSwitches(0)
    setCopyPasteCount(0)
    setCode('')
  }

  // Format mm:ss safely
  const validElapsed = Math.max(0, elapsedSeconds)
  const formattedTime = `${String(Math.floor(validElapsed / 60)).padStart(2, '0')}:${String(validElapsed % 60).padStart(2, '0')}`

  const currentPenalties = tabSwitches * TAB_PENALTY + copyPasteCount * COPY_PASTE_PENALTY

  return {
    // State
    session,
    result,
    isStarting,
    isSubmitting,
    isCanceling,
    elapsedSeconds,
    formattedTime,
    tabSwitches,
    copyPasteCount,
    currentPenalties,
    code,
    setCode,

    // Actions
    startSession,
    submitSolution,
    cancelSession,
    resetSession,
    handleCopyPaste,
  }
}
