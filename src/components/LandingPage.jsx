import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { saveSubmission } from '../utils/storage'
import { getCurrentSession } from '../utils/session'
import { PRODUCTS } from '../constants'
import CountdownTimer from './CountdownTimer'
import './LandingPage.css'

function LandingPage() {
  const [selectedProducts, setSelectedProducts] = useState([])
  const [showFormModal, setShowFormModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [formData, setFormData] = useState({
    Nom: '',
    Numero: '',
    Adresse: ''
  })
  const [currentSession, setCurrentSession] = useState(null)

  useEffect(() => {
    // Get current session data
    const session = getCurrentSession()
    setCurrentSession(session)
  }, [])

  const toggleProduct = (product) => {
    setSelectedProducts(prev => {
      if (prev.includes(product)) {
        return prev.filter(p => p !== product)
      } else if (prev.length < 2) {
        return [...prev, product]
      }
      return prev
    })
  }

  const handleCTAClick = () => {
    if (selectedProducts.length === 0) return
    setShowFormModal(true)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()

    const submissionData = {
      submissionId: `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: currentSession?.sessionId,
      createdAt: new Date().toISOString(),
      dateKey: new Date().toISOString().split('T')[0],
      selectedProducts: selectedProducts.sort(),
      name: formData.Nom,
      phone: formData.Numero,
      address: formData.Adresse,
      utm_campaign: currentSession?.utm_campaign,
      utm_source: currentSession?.utm_source,
      utm_medium: currentSession?.utm_medium,
      campaign: currentSession?.campaign,
      deviceType: currentSession?.deviceType,
      browser: currentSession?.browser,
      referrer: currentSession?.referrer
    }

    saveSubmission(submissionData)
    setShowFormModal(false)
    setShowSuccessModal(true)

    // Auto-hide modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false)
      // Reset form
      setFormData({ Nom: '', Numero: '', Adresse: '' })
    }, 3000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getSelectedText = () => {
    if (selectedProducts.length === 0) return ''
    if (selectedProducts.length === 1) return `Selected: ${PRODUCTS[selectedProducts[0]]}`
    return 'Selected: Both'
  }

  return (
    <div className="landing-page">
      <main className="main-content">
        <div className="hero-section">
          {/* Logo placeholder - replace with your actual logo.png */}
          <div className="logo-placeholder">
            <img src="/logo.png" alt="Apex Visor Logo" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }} />
            <div className="logo-text" style={{display: 'none'}}>
              APEX VISOR
            </div>
          </div>
          <h1>أختار إلي تحب عليها ب40% تخفيض</h1>
        </div>
        <div className="product-cards">
          <div
            className={`product-card ${selectedProducts.includes('A') ? 'selected' : ''}`}
            onClick={() => toggleProduct('A')}
          >
             <div className="prod-placeholder">
             <img src="/prod2.png" alt="Apex Visor Logo" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }} />
            </div>
            <h2>Apex Vision couleur noir edition</h2>
            <div className="pricing-section">
              <span className="old-price">59dt</span>
              <span className="new-price">39dt</span>
            </div>
          
            <div className="free-shipping">
              <span>🚚 توصيل مجاني</span>
            </div>
          </div>

          <div
            className={`product-card ${selectedProducts.includes('B') ? 'selected' : ''}`}
            onClick={() => toggleProduct('B')}
          >
            <div className="prod-placeholder">
             <img src="/prod1.png" alt="Apex Visor Logo" onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }} />
            </div>
            <h2>Apex Vision couleur Gris edition</h2>
            <div className="pricing-section">
              <span className="old-price">59dt</span>
              <span className="new-price">39dt</span>
            </div>
           
            <div className="free-shipping">
              <span>🚚 توصيل مجاني</span>
            </div>
          </div>
        </div>

        {/* {getSelectedText() && (
          <div className="selection-indicator">
            {getSelectedText()}
          </div>
        )} */}

        <button
         className="submit-button-2"
          disabled={selectedProducts.length === 0}
          onClick={handleCTAClick}
        >
          نـــــــحب نــــشري   
        </button>
      </main>

      <footer className="footer">
        <div className="logo-placeholder2">
        <img src="/logo.png" alt="Apex Visor Logo"  onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }} />
        </div>
          
       <h2> Apex Visor </h2>
       © {new Date().getFullYear()} Apex Visor. All rights reserved.
      </footer>
 <CountdownTimer />

      {/* Form Modal */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="form-modal">
            <h3> عرض خاص كان للي طلبو قبل</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="nom">Nom</label>
                <input
                  type="text"
                  id="nom"
                  name="Nom"
                  value={formData.Nom}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrer votre nom"
                />
              </div>
              <div className="form-group">
                <label htmlFor="numero">Numéro de téléphone</label>
                <input
                  type="tel"
                  id="numero"
                  name="Numero"
                  value={formData.Numero}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrer votre numéro de téléphone"
                />
              </div>
              <div className="form-group">
                <label htmlFor="adresse">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  name="Adresse"
                  value={formData.Adresse}
                  onChange={handleInputChange}
                  required
                  placeholder="Entrer votre adresse"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                 نحب ناخوها ب 40% تخفيض
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <h3>Done!</h3>
            <p>We'll send your offer shortly.</p>
          </div>
        </div>
      )}

      {/* Countdown Timer */}
     
    </div>
  )
}

export default LandingPage