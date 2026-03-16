import { useLiveCoding } from '@/hooks/useLiveCoding'
import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import { LiveCodingEditor } from './components/live-coding/LiveCodingEditor'
import { LiveCodingResultScreen } from './components/live-coding/LiveCodingResultScreen'
import { LiveCodingStartScreen } from './components/live-coding/LiveCodingStartScreen'

export default function LiveCodingPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const {
    session,
    result,
    isStarting,
    isSubmitting,
    formattedTime,
    elapsedSeconds,
    tabSwitches,
    copyPasteCount,
    currentPenalties,
    code,
    setCode,
    startSession,
    submitSolution,
    cancelSession,
    resetSession,
    isCanceling,
  } = useLiveCoding()

  useEffect(() => {
    if (!user) {
      Swal.fire(
        'Atención',
        'Debes iniciar sesión para acceder al Live Coding',
        'warning'
      )
      navigate('/challenges')
    }
  }, [user, navigate])

  // ── Start Screen ──────────────────────────────────
  if (!session) {
    return (
      <LiveCodingStartScreen
        startSession={startSession}
        isStarting={isStarting}
      />
    )
  }

  // ── Result Screen ─────────────────────────────────
  if (result) {
    return (
      <LiveCodingResultScreen
        result={result}
        session={session}
        formattedTime={formattedTime}
        resetSession={resetSession}
        startSession={startSession}
      />
    )
  }

  // ── Live Coding Editor ────────────────────────────
  return (
    <LiveCodingEditor
      session={session}
      formattedTime={formattedTime}
      elapsedSeconds={elapsedSeconds}
      currentPenalties={currentPenalties}
      submitSolution={submitSolution}
      isSubmitting={isSubmitting}
      code={code}
      setCode={setCode}
      tabSwitches={tabSwitches}
      copyPasteCount={copyPasteCount}
      cancelSession={cancelSession}
      isCanceling={isCanceling}
    />
  )
}

