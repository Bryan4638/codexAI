import {
    LiveCodingResult,
    LiveCodingSessionResponse,
} from '@/types/challenge'
import { IconArrowLeft, IconBolt, IconTrophy } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { DIFFICULTY_LABELS } from './LiveCodingStartScreen'

interface LiveCodingResultScreenProps {
    result: LiveCodingResult
    session: LiveCodingSessionResponse
    formattedTime: string
    resetSession: () => void
    startSession: (difficulty?: string) => Promise<void>
}

export function LiveCodingResultScreen({
    result,
    session,
    formattedTime,
    resetSession,
    startSession,
}: LiveCodingResultScreenProps) {
    const navigate = useNavigate()
    const difficulty = session.challenge.difficulty

    return (
        <div className="min-h-screen text-white flex items-center justify-center pt-16">
            <div className="max-w-2xl w-full mx-4">
                <div className="bg-bg-card border border-white/10 rounded-2xl p-8 shadow-card">
                    <div className="text-center mb-8">
                        <div
                            className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${result.allPassed
                                ? 'bg-emerald-500/20 border-2 border-emerald-400'
                                : 'bg-rose-500/20 border-2 border-rose-400'
                                }`}
                        >
                            <IconTrophy
                                size={40}
                                className={
                                    result.allPassed ? 'text-emerald-400' : 'text-rose-400'
                                }
                            />
                        </div>
                        <h2 className="text-2xl font-display font-bold mb-2">
                            {result.allPassed ? '¡Reto Completado!' : 'Reto Finalizado'}
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
                            <div className="text-lg font-bold font-mono">{formattedTime}</div>
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
                                className={`text-lg font-bold ${result.allPassed ? 'text-emerald-400' : 'text-rose-400'
                                    }`}
                            >
                                {result.passedTests}/{result.totalTests}
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                            <div className="text-text-muted text-xs mb-1">Dificultad</div>
                            <div
                                className={`text-lg font-bold ${difficulty === 'easy'
                                    ? 'text-emerald-400'
                                    : difficulty === 'medium'
                                        ? 'text-amber-400'
                                        : 'text-rose-400'
                                    }`}
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
                                    <span>🔀 {result.tabSwitches} cambio(s) de pestaña</span>
                                )}
                                {result.copyPasteCount > 0 && (
                                    <span>📋 {result.copyPasteCount} copiado(s)/pegado(s) de código</span>
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
                                        className={`p-3 rounded-lg border text-sm ${tr.passed
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                            }`}
                                    >
                                        Test {idx + 1}:{' '}
                                        {tr.passed ? '✓ Pasó' : `✗ Falló (Output: ${tr.actual})`}
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
