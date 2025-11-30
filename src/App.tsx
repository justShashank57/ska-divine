import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    unitPreference: ''
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  // Handle scroll for sticky button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section)
      }
    })

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section)
        }
      })
    }
  }, [])

  const scrollToContact = () => {
    const contactSection = document.querySelector('.contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you! We will contact you soon.')
    setFormData({ name: '', phone: '', email: '', unitPreference: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="app">
      {/* Sticky Book Site Visit Button */}
      <button 
        className={`sticky-cta ${isScrolled ? 'visible' : ''}`}
        onClick={scrollToContact}
        aria-label="Book Site Visit"
      >
        <span>Book Site Visit</span>
      </button>

      {/* Hero Section */}
      <section className="hero" ref={(el) => { sectionsRef.current[0] = el }}>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">SKA DIVINE</h1>
          <p className="hero-subtitle">Luxury Living Redefined in the Heart of the City</p>
          <div className="hero-highlights">
            <div className="highlight-item">
              <span className="highlight-label">Price Range</span>
              <span className="highlight-value">₹1.2 Cr - ₹2.5 Cr</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Location</span>
              <span className="highlight-value">Prime Downtown</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">RERA</span>
              <span className="highlight-value">RERA Approved</span>
            </div>
            <div className="highlight-item">
              <span className="highlight-label">Possession</span>
              <span className="highlight-value">Q2 2025</span>
            </div>
          </div>
          <div className="hero-cta">
            <button className="btn btn-primary">Download Brochure</button>
            <button className="btn btn-secondary">Book Site Visit</button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights scroll-section" ref={(el) => { sectionsRef.current[1] = el }}>
        <div className="container">
          <h2 className="section-title">Why Choose SKA DIVINE?</h2>
          <div className="highlights-grid">
            <div className="highlight-card scroll-item">
              <div className="highlight-icon">💰</div>
              <h3>Competitive Pricing</h3>
              <p>Starting from ₹1.2 Cr with flexible payment plans</p>
            </div>
            <div className="highlight-card scroll-item">
              <div className="highlight-icon">🏠</div>
              <h3>Spacious Units</h3>
              <p>2BHK & 3BHK apartments ranging from 1200-1800 sq.ft</p>
            </div>
            <div className="highlight-card scroll-item">
              <div className="highlight-icon">🏊</div>
              <h3>Premium Amenities</h3>
              <p>World-class facilities including pool, gym, and clubhouse</p>
            </div>
            <div className="highlight-card scroll-item">
              <div className="highlight-icon">📍</div>
              <h3>Prime Location</h3>
              <p>Close to metro, schools, malls, and IT hubs</p>
            </div>
            <div className="highlight-card scroll-item">
              <div className="highlight-icon">🔒</div>
              <h3>RERA Approved</h3>
              <p>Fully compliant with all regulatory requirements</p>
            </div>
            <div className="highlight-card scroll-item">
              <div className="highlight-icon">📅</div>
              <h3>Early Possession</h3>
              <p>Ready to move in by Q2 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery scroll-section" ref={(el) => { sectionsRef.current[2] = el }}>
        <div className="container">
          <h2 className="section-title">Gallery</h2>
          <div className="gallery-grid">
            <div className="gallery-item scroll-item">
              <div className="gallery-placeholder exterior">Exterior View</div>
            </div>
            <div className="gallery-item scroll-item">
              <div className="gallery-placeholder interior">Interior Design</div>
            </div>
            <div className="gallery-item scroll-item">
              <div className="gallery-placeholder amenities">Amenities</div>
            </div>
            <div className="gallery-item scroll-item">
              <div className="gallery-placeholder lobby">Lobby</div>
            </div>
            <div className="gallery-item scroll-item">
              <div className="gallery-placeholder bedroom">Bedroom</div>
            </div>
            <div className="gallery-item scroll-item">
              <div className="gallery-placeholder kitchen">Kitchen</div>
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plans Section */}
      <section className="floor-plans scroll-section" ref={(el) => { sectionsRef.current[3] = el }}>
        <div className="container">
          <h2 className="section-title">Floor Plans</h2>
          <div className="floor-plans-grid">
            <div className="floor-plan-card scroll-item">
              <div className="floor-plan-image">
                <div className="floor-plan-placeholder">2BHK Floor Plan</div>
              </div>
              <div className="floor-plan-info">
                <h3>2BHK</h3>
                <p>1200 - 1400 sq.ft</p>
                <button className="btn btn-outline">Download Floor Plan</button>
              </div>
            </div>
            <div className="floor-plan-card scroll-item">
              <div className="floor-plan-image">
                <div className="floor-plan-placeholder">3BHK Floor Plan</div>
              </div>
              <div className="floor-plan-info">
                <h3>3BHK</h3>
                <p>1600 - 1800 sq.ft</p>
                <button className="btn btn-outline">Download Floor Plan</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="amenities scroll-section" ref={(el) => { sectionsRef.current[4] = el }}>
        <div className="container">
          <h2 className="section-title">Amenities</h2>
          <div className="amenities-grid">
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🏋️</div>
              <span>Gym & Fitness</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🏊</div>
              <span>Swimming Pool</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🏛️</div>
              <span>Clubhouse</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🚗</div>
              <span>Parking</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">⚡</div>
              <span>Power Backup</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🛡️</div>
              <span>24/7 Security</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🌳</div>
              <span>Landscaped Gardens</span>
            </div>
            <div className="amenity-item scroll-item">
              <div className="amenity-icon">🎯</div>
              <span>Sports Facilities</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location scroll-section" ref={(el) => { sectionsRef.current[5] = el }}>
        <div className="container">
          <h2 className="section-title">Location</h2>
          <div className="location-content">
            <div className="location-map">
              <div className="map-placeholder">Map View</div>
            </div>
            <div className="location-landmarks">
              <h3>Nearby Landmarks</h3>
              <ul className="landmarks-list">
                <li>🏫 International School - 2 km</li>
                <li>🚇 Metro Station - 500 m</li>
                <li>🛍️ Shopping Mall - 1.5 km</li>
                <li>💼 IT Hub - 3 km</li>
                <li>🏥 Hospital - 2.5 km</li>
                <li>✈️ Airport - 15 km</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing scroll-section" ref={(el) => { sectionsRef.current[6] = el }}>
        <div className="container">
          <h2 className="section-title">Pricing</h2>
          <div className="pricing-table-wrapper scroll-item">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Unit Type</th>
                  <th>Area (sq.ft)</th>
                  <th>Starting Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2BHK</td>
                  <td>1200 - 1400</td>
                  <td>₹1.2 Cr</td>
                </tr>
                <tr>
                  <td>3BHK</td>
                  <td>1600 - 1800</td>
                  <td>₹1.8 Cr</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="pricing-note">*Prices are subject to change. Contact us for current rates and availability.</p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact scroll-section" ref={(el) => { sectionsRef.current[7] = el }}>
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">Fill out the form below and we'll get back to you shortly</p>
          <form className="contact-form scroll-item" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <select
                name="unitPreference"
                value={formData.unitPreference}
                onChange={handleChange}
                required
              >
                <option value="">Select Unit Preference</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-large">Request Callback</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SKA DIVINE</h3>
              <p>Premium residential project by SKA Developers</p>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@skadivine.com</p>
              <p>📍 Prime Downtown, City</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#highlights">Highlights</a></li>
                <li><a href="#gallery">Gallery</a></li>
                <li><a href="#amenities">Amenities</a></li>
                <li><a href="#pricing">Pricing</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 SKA DIVINE. All rights reserved.</p>
            <p className="disclaimer">*Images are for representation purposes only. Actual product may vary.</p>
          </div>
      </div>
      </footer>
      </div>
  )
}

export default App
