import { LiveCodingSessionResponse } from '@/types/challenge'
import Editor from '@monaco-editor/react'
import { IconClock, IconSend, IconStar } from '@tabler/icons-react'
import type { editor } from 'monaco-editor'
import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { DIFFICULTY_COLORS, DIFFICULTY_LABELS } from './LiveCodingStartScreen'

interface LiveCodingEditorProps {
    session: LiveCodingSessionResponse
    formattedTime: string
    elapsedSeconds: number
    currentPenalties: number
    submitSolution: () => Promise<void>
    isSubmitting: boolean
    code: string
    setCode: (code: string) => void
    tabSwitches: number
    copyPasteCount: number
    cancelSession: () => Promise<void>
    isCanceling: boolean
    onCopyPaste: () => void
}

export function LiveCodingEditor({
    session,
    formattedTime,
    elapsedSeconds,
    currentPenalties,
    submitSolution,
    isSubmitting,
    code,
    setCode,
    tabSwitches,
    copyPasteCount,
    cancelSession,
    isCanceling,
    onCopyPaste,
}: LiveCodingEditorProps) {
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

    const handleEditorMount = (editorInstance: editor.IStandaloneCodeEditor) => {
        editorRef.current = editorInstance

        editorInstance.onKeyDown((e) => {
            // Detect Ctrl+C, Ctrl+V, Ctrl+X (copy, paste, cut)
            const KeyC = 33  // Monaco KeyCode.KeyC
            const KeyV = 52  // Monaco KeyCode.KeyV
            const KeyX = 54  // Monaco KeyCode.KeyX
            if ((e.ctrlKey || e.metaKey) && [KeyC, KeyV, KeyX].includes(e.keyCode)) {
                onCopyPaste()
            }
        })
    }
    const challenge = session.challenge
    const isTimeCritical = elapsedSeconds >= 1500 // 25 min

    return (
        <div className="min-h-screen text-white flex flex-col pt-16">
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

                    {/* Cancel Button */}
                    <button
                        onClick={cancelSession}
                        disabled={isSubmitting || isCanceling}
                        className="btn flex items-center gap-2 bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 font-bold transition-colors"
                    >
                        {isCanceling ? 'Cancelando...' : 'Cancelar'}
                    </button>

                    {/* Submit Button */}
                    <button
                        onClick={submitSolution}
                        disabled={isSubmitting || isCanceling || !code.trim()}
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
                            {copyPasteCount > 0 && (
                                <span className="text-xs bg-pink-500/10 border border-pink-500/30 text-pink-400 px-2 py-1 rounded-lg">
                                    📋 {copyPasteCount}
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
                            onMount={handleEditorMount}
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
