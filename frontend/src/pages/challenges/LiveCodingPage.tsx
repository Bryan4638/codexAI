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
    resetSession,
  } = useLiveCoding()

  if (!user) {
    sileo.warning({
      title: 'Debes Iniciar Sesión',
      description: (
        <span className="flex items-center justify-center">
          Primero debes iniciar sesión para resolver retos
        </span>
      ),
      icon: <IconAlertTriangle />,
    })
    navigate('/challenges')
  }

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
    />
  )
}

