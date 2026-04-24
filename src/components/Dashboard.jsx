import { useState, useEffect } from 'react'
import { getDashboardAuth, setDashboardAuth } from '../utils/storage'
import { DASHBOARD_PASSWORD } from '../constants'
import DashboardOverview from './DashboardOverview'
import DashboardLeads from './DashboardLeads'
import DashboardAnalytics from './DashboardAnalytics'
import './Dashboard.css'

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState('overview')

  useEffect(() => {
    const auth = getDashboardAuth()
    setIsAuthenticated(auth)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      setDashboardAuth(true)
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  const handleLogout = () => {
    setDashboardAuth(false)
    setIsAuthenticated(false)
    setPassword('')
    setCurrentPage('overview')
  }

  if (!isAuthenticated) {
    return (
      <div className="dashboard-login">
        <div className="login-modal">
          <h2>Dashboard Access</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button">Access Dashboard</button>
          </form>
        </div>
      </div>
    )
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return <DashboardOverview />
      case 'leads':
        return <DashboardLeads />
      case 'analytics':
        return <DashboardAnalytics />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>SMS Offer Dashboard</h1>
        </div>
        <div className="nav-links">
          <button
            className={currentPage === 'overview' ? 'active' : ''}
            onClick={() => setCurrentPage('overview')}
          >
            Overview
          </button>
          <button
            className={currentPage === 'leads' ? 'active' : ''}
            onClick={() => setCurrentPage('leads')}
          >
            Leads
          </button>
          <button
            className={currentPage === 'analytics' ? 'active' : ''}
            onClick={() => setCurrentPage('analytics')}
          >
            Analytics
          </button>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="dashboard-content">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default Dashboard