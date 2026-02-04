'use client'

interface BarChartProps {
  data: { label: string; value: number; color?: string }[]
  height?: number
  showValues?: boolean
}

export function SimpleBarChart({ data, height = 200, showValues = true }: BarChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full gap-2">
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end" style={{ height: height - 40 }}>
                {showValues && item.value > 0 && (
                  <span className="text-xs text-muted-foreground mb-1">
                    {item.value.toLocaleString()}
                  </span>
                )}
                <div
                  className="w-full rounded-t transition-all duration-300"
                  style={{
                    height: `${barHeight}%`,
                    minHeight: item.value > 0 ? 4 : 0,
                    backgroundColor: item.color || '#3b82f6',
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground truncate max-w-full text-center">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface LineChartData {
  date: string
  value: number
}

interface LineChartProps {
  data: LineChartData[]
  height?: number
  color?: string
}

export function SimpleLineChart({ data, height = 200, color = '#3b82f6' }: LineChartProps) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.value), 1)
  const minValue = 0

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 100
    const y = 100 - ((d.value - minValue) / (maxValue - minValue || 1)) * 100
    return { x, y, value: d.value, date: d.date }
  })

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  const areaD = `${pathD} L 100 100 L 0 100 Z`

  return (
    <div className="w-full" style={{ height }}>
      <div className="relative h-full">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.1"
              strokeWidth="0.5"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={areaD}
            fill={color}
            fillOpacity="0.1"
          />
          
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          
          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="1.5"
              fill={color}
              className="hover:r-3 transition-all"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground -mb-5">
          {data.length > 0 && (
            <>
              <span>{formatDate(data[0].date)}</span>
              {data.length > 2 && <span>{formatDate(data[Math.floor(data.length / 2)].date)}</span>}
              <span>{formatDate(data[data.length - 1].date)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: { value: number; isPositive: boolean }
  icon?: React.ReactNode
}

export function StatCard({ title, value, description, trend, icon }: StatCardProps) {
  return (
    <div className="bg-card dark:bg-card p-4 rounded-lg border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {(description || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span
              className={`text-xs font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
