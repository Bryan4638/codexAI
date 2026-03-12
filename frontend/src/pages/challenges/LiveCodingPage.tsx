import { useLiveCoding } from '@/hooks/useLiveCoding'
import { useAuthStore } from '@/store/useAuthStore'
import Editor from '@monaco-editor/react'
import {
    IconArrowLeft,
    IconBolt,
    IconClipboard,
    IconClock,
    IconEye,
    IconPlayerPlayFilled,
    IconSend,
    IconStar,
    IconTrophy,
} from '@tabler/icons-react'
import { useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import Swal from 'sweetalert2'

const DIFFICULTY_LABELS: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
}

const DIFFICULTY_COLORS: Record<string, string> = {
    easy: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    hard: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
}

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
        pasteCount,
        currentPenalties,
        code,
        setCode,
        startSession,
        submitSolution,
        resetSession,
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
            <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center pt-16">
                <div className="max-w-lg w-full mx-4">
                    <div className="bg-bg-card border border-white/10 rounded-2xl p-8 shadow-card text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 border border-white/10 flex items-center justify-center">
                            <IconBolt size={40} className="text-neon-cyan" />
                        </div>
                        <h1 className="text-3xl font-display font-bold mb-3 bg-gradient-to-r from-neon-cyan to-neon-pink bg-clip-text text-transparent">
                            Live Coding
                        </h1>
                        <p className="text-text-secondary mb-8 leading-relaxed">
                            Se te asignará un reto aleatorio y el cronómetro comenzará
                            inmediatamente. Tu puntuación depende del tiempo, los tests
                            pasados y tu comportamiento.
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-8 text-xs">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                <IconClock
                                    size={20}
                                    className="text-neon-cyan mx-auto mb-1"
                                />
                                <span className="text-text-muted">Tiempo</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                <IconEye
                                    size={20}
                                    className="text-amber-400 mx-auto mb-1"
                                />
                                <span className="text-text-muted">Pestaña: -15pts</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                                <IconClipboard
                                    size={20}
                                    className="text-rose-400 mx-auto mb-1"
                                />
                                <span className="text-text-muted">Pegar: -25pts</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => startSession()}
                                disabled={isStarting}
                                className="btn btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
                            >
                                <IconPlayerPlayFilled size={20} />
                                {isStarting ? 'Preparando reto...' : 'Comenzar'}
                            </button>

                            <div className="flex gap-2">
                                {(['easy', 'medium', 'hard'] as const).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => startSession(d)}
                                        disabled={isStarting}
                                        className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all hover:scale-105 ${DIFFICULTY_COLORS[d]}`}
                                    >
                                        {DIFFICULTY_LABELS[d]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/challenges')}
                            className="mt-6 text-text-muted hover:text-white transition-colors text-sm flex items-center gap-1 mx-auto"
                        >
                            <IconArrowLeft size={16} /> Volver a Retos
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // ── Result Screen ─────────────────────────────────
    if (result) {
        const difficulty = session.challenge.difficulty
        return (
            <div className="min-h-screen bg-bg-primary text-white flex items-center justify-center pt-16">
                <div className="max-w-2xl w-full mx-4">
                    <div className="bg-bg-card border border-white/10 rounded-2xl p-8 shadow-card">
                        <div className="text-center mb-8">
                            <div
                                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${result.allPassed ? 'bg-emerald-500/20 border-2 border-emerald-400' : 'bg-rose-500/20 border-2 border-rose-400'}`}
                            >
                                <IconTrophy
                                    size={40}
                                    className={
                                        result.allPassed ? 'text-emerald-400' : 'text-rose-400'
                                    }
                                />
                            </div>
                            <h2 className="text-2xl font-display font-bold mb-2">
                                {result.allPassed
                                    ? '¡Reto Completado!'
                                    : 'Reto Finalizado'}
                            </h2>
                            <div
                                className={
                                    'text-5xl font-display font-black ' +
                                    (result.score > 0
                                        ? 'bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent'
                                        : 'text-text-muted')
                                }
                            >
                                {result.score} pts
                            </div>
                        </div>

                        {/* Stat Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                <div className="text-text-muted text-xs mb-1">Tiempo</div>
                                <div className="text-lg font-bold font-mono">
                                    {formattedTime}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                <div className="text-text-muted text-xs mb-1">Ejecución</div>
                                <div className="text-lg font-bold font-mono text-neon-cyan">
                                    {Number(result.executionTimeMs).toFixed(1)}ms
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                <div className="text-text-muted text-xs mb-1">Tests</div>
                                <div
                                    className={`text-lg font-bold ${result.allPassed ? 'text-emerald-400' : 'text-rose-400'}`}
                                >
                                    {result.passedTests}/{result.totalTests}
                                </div>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                                <div className="text-text-muted text-xs mb-1">Dificultad</div>
                                <div
                                    className={`text-lg font-bold ${difficulty === 'easy' ? 'text-emerald-400' : difficulty === 'medium' ? 'text-amber-400' : 'text-rose-400'}`}
                                >
                                    {DIFFICULTY_LABELS[difficulty]}
                                </div>
                            </div>
                        </div>

                        {/* Penalties */}
                        {result.penaltiesApplied > 0 && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6">
                                <h3 className="text-sm font-bold text-rose-400 mb-2">
                                    Penalizaciones (-{result.penaltiesApplied} pts)
                                </h3>
                                <div className="flex gap-4 text-xs text-rose-300">
                                    {result.tabSwitches > 0 && (
                                        <span>
                                            🔀 {result.tabSwitches} cambio(s) de pestaña
                                        </span>
                                    )}
                                    {result.pasteCount > 0 && (
                                        <span>📋 {result.pasteCount} pegado(s) de código</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Test Results */}
                        {result.testResults.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3">
                                    Resultados de Tests
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {result.testResults.map((tr, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-lg border text-sm ${tr.passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}
                                        >
                                            Test {idx + 1}:{' '}
                                            {tr.passed
                                                ? '✓ Pasó'
                                                : `✗ Falló (Output: ${tr.actual})`}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 text-rose-400 text-sm font-mono whitespace-pre-wrap">
                                {result.error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    resetSession()
                                    startSession()
                                }}
                                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                            >
                                <IconBolt size={18} /> Nuevo Reto
                            </button>
                            <button
                                onClick={() => navigate('/challenges')}
                                className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
                            >
                                <IconArrowLeft size={18} /> Volver a Retos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── Live Coding Editor ────────────────────────────
    const challenge = session.challenge
    const isTimeCritical = elapsedSeconds >= 1500 // 25 min

    return (
        <div className="min-h-screen bg-bg-primary text-white flex flex-col pt-16">
            {/* Header Bar */}
            <header className="px-4 py-3 border-b border-white/10 bg-bg-card flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-display text-neon-cyan truncate max-w-[300px]">
                        {challenge.title}
                    </h1>
                    <span
                        className={`text-xs font-bold px-2 py-1 rounded-lg border ${DIFFICULTY_COLORS[challenge.difficulty]}`}
                    >
                        {DIFFICULTY_LABELS[challenge.difficulty]}
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Timer */}
                    <div
                        className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1.5 rounded-xl border ${isTimeCritical
                                ? 'text-rose-400 border-rose-400/30 bg-rose-400/10 animate-pulse'
                                : 'text-neon-cyan border-neon-cyan/30 bg-neon-cyan/10'
                            }`}
                    >
                        <IconClock size={18} />
                        {formattedTime}
                    </div>

                    {/* Penalty Counter */}
                    {currentPenalties > 0 && (
                        <div className="flex items-center gap-1 text-rose-400 text-sm font-bold bg-rose-400/10 border border-rose-400/30 px-3 py-1.5 rounded-xl">
                            <IconStar size={16} />-{currentPenalties}pts
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={submitSolution}
                        disabled={isSubmitting || !code.trim()}
                        className="btn btn-primary flex items-center gap-2 bg-gradient-to-r from-neon-green/80 to-neon-cyan/80 text-black border-none font-bold"
                    >
                        <IconSend size={18} />
                        {isSubmitting ? 'Evaluando...' : 'Enviar Solución'}
                    </button>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 bg-bg-primary relative">
                {/* Separator */}
                <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-[2px] bg-gradient-primary z-10 -ml-px" />

                {/* Left Panel: Editor */}
                <section className="lg:col-span-2 flex flex-col order-2 lg:order-1 relative z-0">
                    <div className="flex-1 min-h-[60vh] flex flex-col relative">
                        <div className="absolute bottom-2 right-4 z-10 flex items-center gap-2">
                            {tabSwitches > 0 && (
                                <span className="text-xs bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2 py-1 rounded-lg">
                                    🔀 {tabSwitches}
                                </span>
                            )}
                            {pasteCount > 0 && (
                                <span className="text-xs bg-pink-500/10 border border-pink-500/30 text-pink-400 px-2 py-1 rounded-lg">
                                    📋 {pasteCount}
                                </span>
                            )}
                            <span className="text-xs font-mono font-bold text-yellow-500 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                                JavaScript
                            </span>
                        </div>
                        <Editor
                            height="100%"
                            defaultLanguage="javascript"
                            value={code}
                            onChange={(value) => setCode(value || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                fontLigatures: true,
                                fontWeight: 'bold',
                                fontFamily:
                                    "'JetBrains Mono', 'Fira Code', 'Monaco', 'Courier New', monospace",
                                lineHeight: 24,
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                smoothScrolling: true,
                                cursorBlinking: 'smooth',
                                cursorSmoothCaretAnimation: 'on',
                                formatOnPaste: false,
                            }}
                            className="flex-1 w-full"
                        />
                    </div>
                </section>

                {/* Right Panel: Challenge Details */}
                <section className="lg:col-span-1 bg-[#101018] order-1 lg:order-2 p-6 overflow-y-auto max-h-[calc(100vh-130px)] flex flex-col gap-6 z-0 shadow-inner">
                    <div>
                        <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                            Descripción
                        </h2>
                        <div className="prose prose-invert prose-neon max-w-none text-text-secondary leading-relaxed">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {challenge.description}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {challenge.tests && challenge.tests.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                                Casos de Prueba
                            </h2>
                            <div className="flex flex-col gap-3">
                                {challenge.tests.map((tc, idx) => (
                                    <div
                                        key={tc.id}
                                        className="bg-bg-primary border border-white/5 rounded-lg p-4 font-mono text-sm shadow-sm"
                                    >
                                        <div className="mb-2 border-b border-white/5 pb-1">
                                            <span className="text-text-muted text-xs">
                                                {tc.description || `Test ${idx + 1}`}
                                            </span>
                                        </div>
                                        <div className="mb-1">
                                            <span className="text-text-muted">Input: </span>
                                            <span className="text-neon-cyan whitespace-pre-wrap break-all">
                                                {tc.input}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-text-muted">Output: </span>
                                            <span className="text-neon-green whitespace-pre-wrap break-all">
                                                {tc.expectedOutput}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}
