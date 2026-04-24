import { useRef, useEffect } from 'react'

function ChartCanvas({ data, type, color }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !data.length) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Set up dimensions
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => d.value), 1)

    // Draw axes
    ctx.strokeStyle = '#cccccc'
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 0.5

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Y-axis labels
      ctx.fillStyle = '#cccccc'
      ctx.font = '12px Arial'
      ctx.textAlign = 'right'
      const labelValue = Math.round((maxValue / 5) * (5 - i))
      ctx.fillText(labelValue.toString(), padding - 10, y + 4)
    }

    // Draw data
    const barWidth = chartWidth / data.length * 0.8
    const barSpacing = chartWidth / data.length * 0.2

    data.forEach((item, index) => {
      const x = padding + index * (barWidth + barSpacing) + barSpacing / 2
      const barHeight = (item.value / maxValue) * chartHeight
      const y = height - padding - barHeight

      if (type === 'bar') {
        // Draw bar
        ctx.fillStyle = color
        ctx.fillRect(x, y, barWidth, barHeight)

        // Bar border
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, barWidth, barHeight)
      } else if (type === 'line') {
        // Draw line point
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x + barWidth / 2, y + barHeight, 4, 0, Math.PI * 2)
        ctx.fill()

        // Connect points with lines
        if (index > 0) {
          const prevItem = data[index - 1]
          const prevX = padding + (index - 1) * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2
          const prevBarHeight = (prevItem.value / maxValue) * chartHeight
          const prevY = height - padding - prevBarHeight

          ctx.strokeStyle = color
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(x + barWidth / 2, y + barHeight)
          ctx.stroke()
        }
      }

      // X-axis labels (show every 3rd date or so for readability)
      if (index % 3 === 0 || index === data.length - 1) {
        ctx.fillStyle = '#cccccc'
        ctx.font = '10px Arial'
        ctx.textAlign = 'center'
        const date = new Date(item.date)
        const label = `${date.getMonth() + 1}/${date.getDate()}`
        ctx.fillText(label, x + barWidth / 2, height - padding + 15)
      }
    })
  }, [data, type, color])

  return (
    <div className="chart-canvas-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={200}
        style={{ width: '100%', height: '200px' }}
      />
    </div>
  )
}

export default ChartCanvas