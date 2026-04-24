import { useState, useEffect } from 'react'
import './CountdownTimer.css'

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Get or set the countdown end time
    const getCountdownEndTime = () => {
      const stored = localStorage.getItem('countdown_end_time')
      if (stored) {
        return new Date(stored)
      } else {
        // Set countdown for 3 days from now
        const endTime = new Date()
        endTime.setDate(endTime.getDate() + 3)
        localStorage.setItem('countdown_end_time', endTime.toISOString())
        return endTime
      }
    }

    const endTime = getCountdownEndTime()

    const updateCountdown = () => {
      const now = new Date()
      const difference = endTime - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        // Countdown finished
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsVisible(false)
        localStorage.removeItem('countdown_end_time')
      }
    }

    // Update immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const closeCountdown = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="countdown-timer">
      <button className="countdown-close" onClick={closeCountdown} aria-label="Close countdown">
        ×
      </button>

      <div className="countdown-header">
        <div className="countdown-icon">⏰</div>
        <div className="countdown-text">
          <h3>عرض يوفا بعد 3 أيام</h3>
          <p>مزال كان</p>
        </div>
      </div>

      <div className="countdown-numbers">
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.days.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Days</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Min</div>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">
          <div className="countdown-value">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="countdown-label">Sec</div>
        </div>
      </div>

      <div className="countdown-footer">
        <span className="countdown-urgency">⚡متفلتش الفرصة!</span>
      </div>
    </div>
  )
}

export default CountdownTimer