import { useState, useEffect } from 'react'
import { getSessions, getSubmissions, getSessionsLastNDays, getSubmissionsLastNDays, getDateRange, groupByDate } from '../utils/storage'
import ChartCanvas from './ChartCanvas'
import './DashboardOverview.css'

function DashboardOverview() {
  const [kpis, setKpis] = useState({
    totalVisits: 0,
    totalSubmissions: 0,
    conversionRate: 0,
    productASelections: 0,
    productBSelections: 0,
    bothSelections: 0
  })

  const [chartData, setChartData] = useState({
    visits: [],
    submissions: [],
    conversion: []
  })

  useEffect(() => {
    loadKPIs()
    loadChartData()
  }, [])

  const loadKPIs = () => {
    const sessions = getSessions()
    const submissions = getSubmissions()

    // Count product selections
    let productASelections = 0
    let productBSelections = 0
    let bothSelections = 0

    submissions.forEach(sub => {
      const selected = sub.selectedProducts
      if (selected.includes('A') && selected.includes('B')) {
        bothSelections++
      } else if (selected.includes('A')) {
        productASelections++
      } else if (selected.includes('B')) {
        productBSelections++
      }
    })

    const conversionRate = sessions.length > 0 ? (submissions.length / sessions.length * 100).toFixed(1) : 0

    setKpis({
      totalVisits: sessions.length,
      totalSubmissions: submissions.length,
      conversionRate: parseFloat(conversionRate),
      productASelections,
      productBSelections,
      bothSelections
    })
  }

  const loadChartData = () => {
    const days = 14
    const dateRange = getDateRange(days)
    const sessions = getSessionsLastNDays(days)
    const submissions = getSubmissionsLastNDays(days)

    const sessionsByDate = groupByDate(sessions)
    const submissionsByDate = groupByDate(submissions)

    const visitsData = dateRange.map(date => ({
      date,
      value: sessionsByDate[date]?.length || 0
    }))

    const submissionsData = dateRange.map(date => ({
      date,
      value: submissionsByDate[date]?.length || 0
    }))

    const conversionData = dateRange.map(date => {
      const visits = sessionsByDate[date]?.length || 0
      const subs = submissionsByDate[date]?.length || 0
      return {
        date,
        value: visits > 0 ? (subs / visits * 100) : 0
      }
    })

    setChartData({
      visits: visitsData,
      submissions: submissionsData,
      conversion: conversionData
    })
  }

  const getLast7DaysTable = () => {
    const dateRange = getDateRange(7)
    const sessions = getSessionsLastNDays(7)
    const submissions = getSubmissionsLastNDays(7)

    const sessionsByDate = groupByDate(sessions)
    const submissionsByDate = groupByDate(submissions)

    return dateRange.map(date => {
      const visits = sessionsByDate[date]?.length || 0
      const subs = submissionsByDate[date]?.length || 0
      const conversion = visits > 0 ? (subs / visits * 100).toFixed(1) : '0.0'

      return {
        date: new Date(date).toLocaleDateString(),
        visits,
        submissions: subs,
        conversion: parseFloat(conversion)
      }
    })
  }

  return (
    <div className="dashboard-overview">
      <h2>Overview</h2>

      <div className="kpi-cards">
        <div className="kpi-card">
          <h3>Total Visits</h3>
          <div className="kpi-value">{kpis.totalVisits}</div>
        </div>
        <div className="kpi-card">
          <h3>Total Submissions</h3>
          <div className="kpi-value">{kpis.totalSubmissions}</div>
        </div>
        <div className="kpi-card">
          <h3>Conversion Rate</h3>
          <div className="kpi-value">{kpis.conversionRate}%</div>
        </div>
        <div className="kpi-card">
          <h3>Product A Selected</h3>
          <div className="kpi-value">{kpis.productASelections}</div>
        </div>
        <div className="kpi-card">
          <h3>Product B Selected</h3>
          <div className="kpi-value">{kpis.productBSelections}</div>
        </div>
        <div className="kpi-card">
          <h3>Both Selected</h3>
          <div className="kpi-value">{kpis.bothSelections}</div>
        </div>
      </div>

      <div className="charts-section">
        <h3>Last 14 Days</h3>
        <div className="charts-grid">
          <div className="chart-container">
            <h4>Visits per Day</h4>
            <ChartCanvas data={chartData.visits} type="bar" color="#00d4ff" />
          </div>
          <div className="chart-container">
            <h4>Submissions per Day</h4>
            <ChartCanvas data={chartData.submissions} type="bar" color="#ff6b6b" />
          </div>
          <div className="chart-container">
            <h4>Conversion Rate per Day</h4>
            <ChartCanvas data={chartData.conversion} type="line" color="#4ecdc4" />
          </div>
        </div>
      </div>

      <div className="table-section">
        <h3>Last 7 Days</h3>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visits</th>
                <th>Submissions</th>
                <th>Conversion %</th>
              </tr>
            </thead>
            <tbody>
              {getLast7DaysTable().map((row, index) => (
                <tr key={index}>
                  <td>{row.date}</td>
                  <td>{row.visits}</td>
                  <td>{row.submissions}</td>
                  <td>{row.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardOverview