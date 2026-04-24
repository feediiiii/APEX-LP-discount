import { useState, useEffect } from 'react'
import { getSubmissions } from '../utils/storage'
import { PRODUCTS } from '../constants'
import ChartCanvas from './ChartCanvas'
import './DashboardAnalytics.css'

function DashboardAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    productDistribution: [],
    campaignData: [],
    submissionsByCampaign: []
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = () => {
    const submissions = getSubmissions()

    // Product distribution
    let productAOnly = 0
    let productBOnly = 0
    let bothProducts = 0

    submissions.forEach(sub => {
      const selected = sub.selectedProducts
      if (selected.includes('A') && selected.includes('B')) {
        bothProducts++
      } else if (selected.includes('A')) {
        productAOnly++
      } else if (selected.includes('B')) {
        productBOnly++
      }
    })

    const productDistribution = [
      { label: `${PRODUCTS.A} Only`, value: productAOnly, color: '#00d4ff' },
      { label: `${PRODUCTS.B} Only`, value: productBOnly, color: '#ff6b6b' },
      { label: 'Both Products', value: bothProducts, color: '#4ecdc4' }
    ]

    // Campaign data
    const campaignCounts = {}
    submissions.forEach(sub => {
      const campaign = sub.utm_campaign || sub.campaign || 'Direct'
      campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1
    })

    const campaignData = Object.entries(campaignCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5) // Top 5 campaigns
      .map(([campaign, count]) => ({ campaign, count }))

    // For horizontal bar chart
    const submissionsByCampaign = campaignData.map(item => ({
      date: item.campaign,
      value: item.count
    }))

    setAnalyticsData({
      productDistribution,
      campaignData,
      submissionsByCampaign
    })
  }

  const renderProductDistributionChart = () => {
    const total = analyticsData.productDistribution.reduce((sum, item) => sum + item.value, 0)
    if (total === 0) return <div className="no-data">No data available</div>

    const maxValue = Math.max(...analyticsData.productDistribution.map(d => d.value))

    return (
      <div className="product-distribution-bars">
        {analyticsData.productDistribution.map((item, index) => (
          <div key={index} className="distribution-bar">
            <div className="bar-label">
              <span className="label-text">{item.label}</span>
              <span className="label-value">{item.value}</span>
            </div>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color
                }}
              />
            </div>
            <div className="bar-percentage">
              {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="dashboard-analytics">
      <h2>Analytics</h2>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Product Selection Distribution</h3>
          {renderProductDistributionChart()}
        </div>

        <div className="analytics-card">
          <h3>Top 5 Campaigns</h3>
          <div className="campaign-chart">
            {analyticsData.submissionsByCampaign.length === 0 ? (
              <div className="no-data">No campaign data available</div>
            ) : (
              <ChartCanvas
                data={analyticsData.submissionsByCampaign}
                type="bar"
                color="#00d4ff"
              />
            )}
          </div>
          <div className="campaign-list">
            {analyticsData.campaignData.map((item, index) => (
              <div key={index} className="campaign-item">
                <span className="campaign-name">{item.campaign}</span>
                <span className="campaign-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h3>Submissions vs Visits (Conversion)</h3>
          <div className="conversion-chart">
            {/* This could reuse the conversion chart from overview or show a different view */}
            <div className="placeholder-chart">
              <p>Conversion trends can be viewed in the Overview tab</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAnalytics