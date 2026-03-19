import {
    IconArrowLeft,
    IconBolt,
    IconClipboard,
    IconClock,
    IconEye,
    IconPlayerPlayFilled,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export const DIFFICULTY_LABELS: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
}

export const DIFFICULTY_COLORS: Record<string, string> = {
    easy: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
    medium: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
    hard: 'text-rose-400 border-rose-400/30 bg-rose-400/10',
}

interface LiveCodingStartScreenProps {
    startSession: (difficulty?: string) => Promise<void>
    isStarting: boolean
}

export function LiveCodingStartScreen({
    startSession,
    isStarting,
}: LiveCodingStartScreenProps) {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen text-white flex items-center justify-center pt-16">
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
                            <IconClock size={20} className="text-neon-cyan mx-auto mb-1" />
                            <span className="text-text-muted">Tiempo</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <IconEye size={20} className="text-amber-400 mx-auto mb-1" />
                            <span className="text-text-muted">Pestaña: -15pts</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <IconClipboard size={20} className="text-rose-400 mx-auto mb-1" />
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
