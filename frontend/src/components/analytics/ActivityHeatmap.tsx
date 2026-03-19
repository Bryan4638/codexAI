import { useAnalytics } from '@/hooks/useAnalytics'
import type { HeatmapDay } from '@/types/analytics'
import { clsx } from 'clsx'
import { useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

const MONTHS = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

const DAYS = ['', 'Lun', '', 'Mié', '', 'Vie', '']

const LEVEL_COLORS = [
  'bg-white/[0.04]',           // level 0 - no activity
  'bg-emerald-900/60',         // level 1
  'bg-emerald-700/70',         // level 2
  'bg-emerald-500/80',         // level 3
  'bg-emerald-400',            // level 4
]

interface ActivityHeatmapProps {
  className?: string
}

export default function ActivityHeatmap({ className }: ActivityHeatmapProps) {
  const { heatmapQuery } = useAnalytics()
  const { data, isLoading } = heatmapQuery
  const [tooltip, setTooltip] = useState<{
    day: HeatmapDay
    x: number
    y: number
  } | null>(null)

  // Organize days into weeks (columns) for the grid
  const { weeks, monthLabels } = useMemo(() => {
    if (!data?.days?.length) return { weeks: [], monthLabels: [] }

    const days = data.days
    // Pad the beginning so the first day starts at the correct weekday row
    const firstDate = new Date(days[0].date + 'T12:00:00')
    const startDow = firstDate.getDay() // 0=Sunday
    const paddedDays: (HeatmapDay | null)[] = [
      ...Array(startDow).fill(null),
      ...days,
    ]

    // Split into weeks (columns of 7)
    const weekArr: (HeatmapDay | null)[][] = []
    for (let i = 0; i < paddedDays.length; i += 7) {
      weekArr.push(paddedDays.slice(i, i + 7))
    }

    // Calculate month labels
    const labels: { label: string; col: number; widthCols: number }[] = []
    let lastMonth = -1
    weekArr.forEach((week, colIdx) => {
      const firstDayInWeek = week.find((d) => d !== null)
      if (firstDayInWeek) {
        const month = new Date(firstDayInWeek.date + 'T12:00:00').getMonth()
        if (month !== lastMonth) {
          if (labels.length > 0) {
            labels[labels.length - 1].widthCols = colIdx - labels[labels.length - 1].col
          }
          labels.push({ label: MONTHS[month], col: colIdx, widthCols: 4 }) // default 4 weeks
          lastMonth = month
        }
      }
    })

    return { weeks: weekArr, monthLabels: labels }
  }, [data])

  if (isLoading) {
    return (
      <div
        className={clsx(
          'animate-pulse rounded-2xl bg-white/5 backdrop-blur-md h-40',
          className
        )}
      />
    )
  }

  if (!data) return null

  const handleMouseEnter = (
    day: HeatmapDay,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltip({ day, x: rect.left + rect.width / 2, y: rect.top })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('es-ES', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div
      className={clsx(
        'rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-5 backdrop-blur-md',
        className
      )}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80">
          Actividad del último año
        </h3>
        <div className="flex items-center gap-4 text-xs text-white/40">
          <span>
            <strong className="text-emerald-400 font-semibold">
              {data.totalActiveDays}
            </strong>{' '}
            días activos
          </span>
          <span>
            <strong className="text-white/70 font-semibold">
              {data.totalExercises + data.totalChallenges}
            </strong>{' '}
            completados
          </span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="w-full">
        <div className="flex flex-col gap-0.5 w-full">
          {/* Month labels */}
          <div className="relative w-full h-[15px] pl-[28px] overflow-hidden">
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="absolute text-[10px] text-white/30"
                style={{
                  left: `calc(28px + ${(m.col / weeks.length) * 100}% - ${(m.col / weeks.length) * 28}px)`,
                }}
              >
                {m.label}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          <div className="flex gap-0.5 w-full">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1 pt-0.5 shrink-0">
              {DAYS.map((label, i) => (
                <div
                  key={i}
                  className="w-6 text-[9px] text-white/25 leading-[none] flex-1 flex items-center justify-end pr-1"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div 
              className="grid gap-[2px] flex-1"
              style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}
            >
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[2px]">
                  {Array.from({ length: 7 }).map((_, dayIdx) => {
                    const day = week[dayIdx] ?? null
                    if (!day) {
                      return (
                        <div
                          key={dayIdx}
                          className="w-full aspect-square rounded-[2px]"
                        />
                      )
                    }
                    return (
                      <div
                        key={dayIdx}
                        className={clsx(
                          'w-full aspect-square rounded-[2px] cursor-pointer transition-all duration-150',
                          LEVEL_COLORS[day.level],
                          'hover:ring-1 hover:ring-white/40 hover:scale-[1.3]'
                        )}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-white/30">
            <span className="mr-1">Menos</span>
            {LEVEL_COLORS.map((color, i) => (
              <div
                key={i}
                className={clsx('h-[11px] w-[11px] rounded-[2px]', color)}
              />
            ))}
            <span className="ml-1">Más</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip &&
        createPortal(
          <div
            className="fixed z-[99999] rounded-lg bg-gray-900 border border-white/20 px-3 py-2 text-xs text-white shadow-xl pointer-events-none"
            style={{
              left: tooltip.x,
              top: tooltip.y - 8,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <p className="font-medium text-white/90">
              {formatDate(tooltip.day.date)}
            </p>
            <p className="text-white/50 mt-0.5">
              {tooltip.day.count === 0
                ? 'Sin actividad'
                : `${tooltip.day.exercisesCompleted} ejercicios · ${tooltip.day.challengesCompleted} retos · ${tooltip.day.xpEarned} XP`}
            </p>
          </div>,
          document.body
        )}
    </div>
  )
}
