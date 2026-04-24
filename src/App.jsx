import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import NotFound from './components/NotFound'
import { initializeSession } from './utils/session'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize session tracking on app load
    initializeSession();
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch-all route for 404 - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
