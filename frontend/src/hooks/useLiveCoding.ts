import { challengeApi } from '@/services/endpoints/challenges'
import type {
  LiveCodingResult,
  LiveCodingSessionResponse,
} from '@/types/challenge'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sileo } from 'sileo'

const TAB_PENALTY = 15
const PASTE_PENALTY = 25

export function useLiveCoding() {
  const [session, setSession] = useState<LiveCodingSessionResponse | null>(null)
  const [result, setResult] = useState<LiveCodingResult | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [tabSwitches, setTabSwitches] = useState(0)
  const [pasteCount, setPasteCount] = useState(0)
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

  // ── Paste Detection ───────────────────────────────
  const handlePaste = useCallback(() => {
    if (!session || result) return

    setPasteCount((prev) => {
      const newVal = prev + 1
      sileo.warning({
        title: `Pegado de código detectado (-${PASTE_PENALTY} pts)`,
      })
      return newVal
    })
  }, [session, result])

  useEffect(() => {
    if (!session || result) return

    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [session, result, handlePaste])

  // ── Actions ───────────────────────────────────────
  const startSession = async (difficulty?: string) => {
    setIsStarting(true)
    setResult(null)
    setElapsedSeconds(0)
    setTabSwitches(0)
    setPasteCount(0)

    try {
      const res = await challengeApi.startLiveCoding(difficulty)
      setSession(res)
      setCode(res.challenge.initialCode || '')
    } catch (error: any) {
      sileo.error({
        title: error?.message || 'Error',
      })
    } finally {
      setIsStarting(false)
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
        timeTakenSeconds: elapsedSeconds,
        tabSwitches,
        pasteCount,
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
        title: error?.message || 'Error',
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
    setPasteCount(0)
    setCode('')
  }

  // Format mm:ss
  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:${String(elapsedSeconds % 60).padStart(2, '0')}`

  const currentPenalties =
    tabSwitches * TAB_PENALTY + pasteCount * PASTE_PENALTY

  return {
    // State
    session,
    result,
    isStarting,
    isSubmitting,
    elapsedSeconds,
    formattedTime,
    tabSwitches,
    pasteCount,
    currentPenalties,
    code,
    setCode,

    // Actions
    startSession,
    submitSolution,
    resetSession,
  }
}
