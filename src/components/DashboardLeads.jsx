import { useState, useEffect } from 'react'
import { getSubmissions } from '../utils/storage'
import { PRODUCTS } from '../constants'
import './DashboardLeads.css'

function DashboardLeads() {
  const [submissions, setSubmissions] = useState([])
  const [filteredSubmissions, setFilteredSubmissions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [campaignFilter, setCampaignFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    loadSubmissions()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [submissions, searchTerm, campaignFilter, dateFrom, dateTo])

  const loadSubmissions = () => {
    const data = getSubmissions()
    setSubmissions(data)
  }

  const applyFilters = () => {
    let filtered = [...submissions]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sub =>
        sub.submissionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.name && sub.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sub.email && sub.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sub.phone && sub.phone.includes(searchTerm)) ||
        (sub.campaign && sub.campaign.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sub.utm_campaign && sub.utm_campaign.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Campaign filter
    if (campaignFilter) {
      filtered = filtered.filter(sub =>
        sub.campaign === campaignFilter || sub.utm_campaign === campaignFilter
      )
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom)
      filtered = filtered.filter(sub => new Date(sub.createdAt) >= fromDate)
    }

    if (dateTo) {
      const toDate = new Date(dateTo)
      toDate.setHours(23, 59, 59, 999) // End of day
      filtered = filtered.filter(sub => new Date(sub.createdAt) <= toDate)
    }

    setFilteredSubmissions(filtered)
  }

  const getUniqueCampaigns = () => {
    const campaigns = new Set()
    submissions.forEach(sub => {
      if (sub.campaign) campaigns.add(sub.campaign)
      if (sub.utm_campaign) campaigns.add(sub.utm_campaign)
    })
    return Array.from(campaigns)
  }

  const getSelectedProductsText = (products) => {
    if (products.length === 2) return 'Both'
    if (products.includes('A')) return PRODUCTS.A
    if (products.includes('B')) return PRODUCTS.B
    return 'None'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  }

  const truncateReferrer = (referrer) => {
    if (!referrer) return '-'
    if (referrer.length <= 30) return referrer
    return referrer.substring(0, 27) + '...'
  }

  const exportToCSV = () => {
    const headers = [
      'Submission ID',
      'Date/Time',
      'Name',
      'Email',
      'Phone',
      'Selected Products',
      'Campaign',
      'Device Type',
      'Browser',
      'Referrer',
      'Session ID'
    ]

    const csvData = filteredSubmissions.map(sub => [
      sub.submissionId,
      formatDate(sub.createdAt),
      sub.name || '-',
      sub.email || '-',
      sub.phone || '-',
      getSelectedProductsText(sub.selectedProducts),
      sub.utm_campaign || sub.campaign || '-',
      sub.deviceType,
      sub.browser,
      sub.referrer || '-',
      sub.sessionId
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `leads_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCampaignFilter('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="dashboard-leads">
      <div className="leads-header">
        <h2>Leads</h2>
        <button className="export-button" onClick={exportToCSV}>
          Export CSV
        </button>
      </div>

      <div className="filters-section">
        <div className="filter-row">
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by name, email, phone, ID or campaign..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Campaign:</label>
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
            >
              <option value="">All Campaigns</option>
              {getUniqueCampaigns().map(campaign => (
                <option key={campaign} value={campaign}>{campaign}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>From Date:</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>To Date:</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <button className="clear-filters-button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Submission ID</th>
              <th>Date/Time</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Selected Products</th>
              <th>Campaign</th>
              <th>Device</th>
              <th>Referrer</th>
              <th>Session ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length === 0 ? (
              <tr>
                <td colSpan="10" className="no-data">No leads found</td>
              </tr>
            ) : (
              filteredSubmissions.map((submission) => (
                <tr key={submission.submissionId}>
                  <td className="submission-id">{submission.submissionId}</td>
                  <td>{formatDate(submission.createdAt)}</td>
                  <td>{submission.name || '-'}</td>
                  <td>{submission.email || '-'}</td>
                  <td>{submission.phone || '-'}</td>
                  <td>{getSelectedProductsText(submission.selectedProducts)}</td>
                  <td>{submission.utm_campaign || submission.campaign || '-'}</td>
                  <td>{submission.deviceType}</td>
                  <td title={submission.referrer}>{truncateReferrer(submission.referrer)}</td>
                  <td className="session-id">{submission.sessionId}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="leads-summary">
        Showing {filteredSubmissions.length} of {submissions.length} leads
      </div>
    </div>
  )
}

export default DashboardLeads