import Loading from '@/components/share/Loading'
import { useChallenges } from '@/hooks/useChallenges'
import { executionApi } from '@/services/endpoints/execution'
import { useAuthStore } from '@/store/useAuthStore'
import type {
  ExecuteResponse,
  ExecuteWithTestsResponse,
} from '@/types/execution'
import Editor from '@monaco-editor/react'
import {
  IconArrowLeft,
  IconMoodHappy,
  IconPlayerPlayFilled,
  IconSkull,
  IconTestPipe,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { sileo } from 'sileo'

export default function EditorPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const {
    data: challenge,
    isPending: isChallengeLoading,
    isError: isChallengeError,
  } = useChallenges(id).challengeQuery

  const [code, setCode] = useState('')
  const [output, setOutput] = useState<ExecuteResponse | null>(null)
  const [testResults, setTestResults] =
    useState<ExecuteWithTestsResponse | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  useEffect(() => {
    if (challenge && id) {
      // Prioritize saved draft over initial code
      const savedDraft = localStorage.getItem(`draft_${id}`)
      setCode(savedDraft || challenge.initialCode || '')
    }
  }, [challenge, id])

  // Save automatically the progress (Debounce of 1s)
  useEffect(() => {
    if (!id || !code.trim() || isChallengeLoading) return

    const timer = setTimeout(() => {
      localStorage.setItem(`draft_${id}`, code)
    }, 1000)

    return () => clearTimeout(timer)
  }, [code, id, isChallengeLoading])

  const handleExecuteFree = async () => {
    if (!code.trim()) return
    setIsExecuting(true)
    setTestResults(null)
    try {
      const res = await executionApi.execute({
        language: 'javascript', // Assume JavaScript for now
        code,
      })
      setOutput(res)
    } catch (error: any) {
      setOutput({
        success: false,
        output: '',
        error: error.response?.data?.message || 'Error en la ejecución',
        exitCode: 1,
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const handleExecuteTests = async () => {
    if (!code.trim() || !user || !id) return
    setIsExecuting(true)
    setOutput(null)
    try {
      const res = await executionApi.executeWithTests({
        challengeId: id,
        language: 'javascript',
        code,
      })
      setTestResults(res)
      if (res.allPassed) {
        // Clear localStorage when challenge is completed successfully
        localStorage.removeItem(`draft_${id}`)

        sileo.success({
          title: '¡Todos los tests pasaron!',
          icon: <IconMoodHappy />,
        })
      } else {
        sileo.error({ title: 'Algunos tests fallaron', icon: <IconSkull /> })
      }
    } catch (error: any) {
      setOutput({
        success: false,
        output: '',
        error: error.response?.data?.message || 'Error al evaluar tests',
        exitCode: 1,
      })
    } finally {
      setIsExecuting(false)
    }
  }
  if (!user) navigate('/challenges')
  if (isChallengeLoading) return <Loading section="editor" />
  if (!challenge) return null
  if (isChallengeError) {
    sileo.error({ title: 'Reto no encontrado', icon: <IconSkull /> })
    navigate('/challenges')
    return
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white flex flex-col pt-16">
      <header className="px-6 py-4 border-b border-white/10 flex items-left justify-between flex-col sm:flex-row gap-4 bg-bg-card">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/challenges')}
            className="text-text-muted hover:text-white transition-colors"
          >
            <IconArrowLeft />
          </button>
          <h1 className="text-xl font-display text-neon-cyan">
            {challenge.title}
          </h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleExecuteFree}
            disabled={isExecuting}
            className="btn btn-secondary shadow-none flex items-center gap-1"
          >
            <IconPlayerPlayFilled size={18} />
            {isExecuting ? 'Ejecutando...' : 'Ejecutar (Libre)'}
          </button>
          <button
            onClick={handleExecuteTests}
            disabled={isExecuting}
            className="btn btn-primary flex items-center bg-linear-to-r gap-1 from-neon-green/80 to-neon-cyan/80 text-black border-none"
          >
            <IconTestPipe size={18} />
            Ejecutar con Tests
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 bg-bg-primary relative">
        {/* Visual separator (visible on large screens) */}
        <div className="hidden lg:block absolute left-2/3 top-0 bottom-0 w-0.5 bg-gradient-primary z-10 -ml-px" />

        {/* Left Panel: Editor and Console */}
        <section className="lg:col-span-2 flex flex-col order-2 sm:order-1 relative z-0">
          {/* Editor Area */}
          <div className="flex-1 min-h-[50vh] flex flex-col relative border-b border-white/10">
            <h2 className="text-xs font-mono font-bold text-yellow-500 mb-2 absolute bottom-2 right-4 z-10 bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded backdrop-blur-sm shadow-[0_0_10px_rgba(234,179,8,0.2)]">
              JavaScript
            </h2>
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
                formatOnPaste: true,
              }}
              className="flex-1 w-full"
            />
          </div>

          {/* Console Area */}
          <div className="h-64 bg-[#050508] p-4 overflow-y-auto font-mono text-sm border-t border-white/5">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <IconTestPipe size={14} /> Consola de Salida
            </h2>

            {output && (
              <pre
                className={`whitespace-pre-wrap ${
                  output.success ? 'text-neon-green' : 'text-neon-pink'
                }`}
              >
                {output.error
                  ? `${output.output}\n${output.error}`.trim()
                  : output.output}
              </pre>
            )}

            {testResults && (
              <div className="mt-2 space-y-2">
                <div
                  className={`font-bold ${testResults.allPassed ? 'text-neon-green' : 'text-neon-pink'}`}
                >
                  {testResults.allPassed
                    ? '✓ Todos los tests pasaron'
                    : '✗ Algunos tests fallaron'}
                  {` (${Number(testResults.executionTimeMs).toFixed(2)}ms)`}
                </div>
                {testResults.error && (
                  <div className="p-3 rounded border bg-neon-pink/10 border-neon-pink/30 text-neon-pink whitespace-pre-wrap">
                    {testResults.error}
                  </div>
                )}
                {testResults.testResults.map((tr, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border ${tr.passed ? 'bg-neon-green/10 border-neon-green/30 text-neon-green' : 'bg-neon-pink/10 border-neon-pink/30 text-neon-pink'}`}
                  >
                    Caso {idx + 1}:{' '}
                    {tr.passed ? 'Pasó' : `Falló (Output: ${tr.actual})`}
                  </div>
                ))}
              </div>
            )}

            {!output && !testResults && (
              <div className="text-text-muted italic opacity-50">
                La salida del programa aparecerá aquí...
              </div>
            )}
          </div>
        </section>

        {/* Right Panel: Challenge Details */}
        <section className="lg:col-span-1 bg-[#101018] order-1 sm:order-2 p-6 overflow-y-auto max-h-[calc(100vh-80px)] flex flex-col gap-6 z-0 shadow-inner">
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

          {challenge.testCases && challenge.testCases.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                Casos de Prueba (Ejemplos)
              </h2>
              <div className="flex flex-col gap-3">
                {challenge.testCases.map((tc, idx) => (
                  <div
                    key={idx}
                    className="bg-bg-primary border border-white/5 rounded-lg p-4 font-mono text-sm shadow-sm"
                  >
                    <div className="mb-2 border-b border-white/5 pb-1">
                      <span className="text-text-muted text-xs">
                        Ejemplo {idx + 1}
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
                        {tc.output}
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
