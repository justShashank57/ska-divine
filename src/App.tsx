import { useState, useEffect, useRef } from 'react'
import skaIntroVideo from './assets/skaIntro.mp4'
import amenity1 from './assets/amenities/1.png'
import amenity2 from './assets/amenities/2.png'
import amenity3 from './assets/amenities/3.png'
import amenity4 from './assets/amenities/4.png'
import amenity5 from './assets/amenities/5.png'
import amenity6 from './assets/amenities/6.png'
import amenity7 from './assets/amenities/7.png'
import amenity8 from './assets/amenities/8.png'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [formErrors, setFormErrors] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'brochure' | 'pricing' | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [showFloorPlans, setShowFloorPlans] = useState(true)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const carouselVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Gallery items - can be images or videos
  const galleryItems = [
    { type: 'image', src: '/gallery/exterior.jpg', title: 'Exterior View', placeholder: 'exterior' },
    { type: 'video', src: '/gallery/interior-video.mp4', title: 'Interior Design', placeholder: 'interior' },
    { type: 'image', src: '/gallery/amenities.jpg', title: 'Amenities', placeholder: 'amenities' },
    { type: 'image', src: '/gallery/lobby.jpg', title: 'Lobby', placeholder: 'lobby' },
    { type: 'video', src: '/gallery/bedroom-video.mp4', title: 'Bedroom', placeholder: 'bedroom' },
    { type: 'image', src: '/gallery/kitchen.jpg', title: 'Kitchen', placeholder: 'kitchen' },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Auto-play videos when they come into view
  useEffect(() => {
    carouselVideoRefs.current.forEach((video, index) => {
      if (video && index === currentSlide && galleryItems[index]?.type === 'video') {
        video.play().catch(() => {
          // Autoplay prevented, user interaction required
        })
      } else if (video) {
        video.pause()
      }
    })
  }, [currentSlide, galleryItems])

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if gallery section is in view
      const gallerySection = document.getElementById('gallery')
      if (!gallerySection) return
      
      const rect = gallerySection.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      
      if (isInView) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setCurrentSlide((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          setCurrentSlide((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [galleryItems.length])

  // Handle scroll for sticky button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Ensure video plays
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay prevented:', error)
      })
    }
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

  const validateForm = () => {
    const errors = {
      name: '',
      phone: '',
      email: '',
      message: ''
    }
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters'
      isValid = false
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required'
      isValid = false
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number'
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Message is optional, no validation needed

    setFormErrors(errors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const sendEmail = async (data: typeof formData, type: 'contact' | 'brochure' | 'pricing') => {
    const subject = type === 'contact' 
      ? 'Contact Form Submission - SKA Divine'
      : type === 'brochure'
      ? 'Brochure Download Request - SKA Divine'
      : 'Pricing PDF Download Request - SKA Divine'
    
    const body = `Name: ${data.name}%0D%0A` +
                 `Phone: ${data.phone}%0D%0A` +
                 `Email: ${data.email}%0D%0A` +
                 (data.message ? `Message: ${data.message}%0D%0A` : '') +
                 `%0D%0ARequest Type: ${type === 'contact' ? 'Contact Form' : type === 'brochure' ? 'Brochure Download' : 'Pricing PDF Download'}`
    
    window.location.href = `mailto:kshashank659@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`
  }

  const downloadPDF = (type: 'brochure' | 'pricing') => {
    // Create a temporary link to trigger download
    // In production, you would link to actual PDF files
    const link = document.createElement('a')
    link.href = type === 'brochure' ? '/brochure.pdf' : '/pricing.pdf'
    link.download = type === 'brochure' ? 'SKA-Divine-Brochure.pdf' : 'SKA-Divine-Pricing.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await sendEmail(formData, 'contact')
      alert('Thank you! We will contact you soon.')
      setFormData({ name: '', phone: '', email: '', message: '' })
      setFormErrors({ name: '', phone: '', email: '', message: '' })
    } catch (error) {
      alert('There was an error submitting the form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      if (modalType) {
        await sendEmail(formData, modalType)
        downloadPDF(modalType)
        setShowModal(false)
        setModalType(null)
        setFormData({ name: '', phone: '', email: '', message: '' })
        setFormErrors({ name: '', phone: '', email: '', message: '' })
        alert('Thank you! Your download will begin shortly.')
      }
    } catch (error) {
      alert('There was an error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openModal = (type: 'brochure' | 'pricing') => {
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType(null)
    setFormData({ name: '', phone: '', email: '', message: '' })
    setFormErrors({ name: '', phone: '', email: '', message: '' })
  }

  return (
    <div className="w-full overflow-x-hidden">
      {/* Sticky Book Site Visit Button */}
      <button 
        className={`fixed top-4 right-4 md:top-8 md:right-8 z-[1000] px-6 py-2.5 md:px-8 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-full font-heading font-semibold text-xs md:text-sm cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4),0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 tracking-wide ${
          isScrolled 
            ? 'opacity-100 visible scale-100 translate-y-0' 
            : 'opacity-0 invisible scale-90 -translate-y-5'
        } hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-100`}
        onClick={scrollToContact}
        aria-label="Book Site Visit"
      >
        <span>Book Site Visit</span>
      </button>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0f2e] via-royal-purple to-deep-purple text-white text-center p-8 overflow-hidden" ref={(el) => { sectionsRef.current[0] = el }}>
        <video 
          ref={videoRef}
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover z-0 brightness-[0.9] contrast-[1.1] saturate-[1.1] pointer-events-none backface-hidden will-change-transform opacity-70 md:opacity-70 opacity-65" 
          autoPlay 
          loop 
          muted 
          playsInline
        >
          <source src={skaIntroVideo} type="video/mp4" />
        </video>
        {/* Gold particles effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,223,165,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none z-[1]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/25 via-deep-purple/20 to-[#1a0f2e]/25 z-[2]"></div>
        <div className="relative z-[3] max-w-4xl animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 tracking-wider text-gold text-shadow-gold">SKA DIVINE</h1>
          <p className="font-body text-lg md:text-2xl mb-12 opacity-95 italic text-soft-gold-glow">Luxury Living Redefined in the Heart of the City</p>
          <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:gap-8 mb-12 p-6 md:p-10 bg-royal-purple/75 backdrop-blur-[20px] rounded-2xl border-2 border-gold/50 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)]">
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">Price Range</span>
              <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">₹1.2 Cr - ₹2.5 Cr</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">Location</span>
              <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">Prime Downtown</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">RERA</span>
              <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">RERA Approved</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">Possession</span>
              <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">Q2 2025</span>
            </div>
          </div>
          <div className="flex gap-6 justify-center flex-wrap">
            <button className="px-8 md:px-10 py-2.5 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)]" onClick={() => openModal('brochure')}>Download Brochure</button>
            <button className="px-8 md:px-10 py-2.5 md:py-3.5 bg-transparent text-gold border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer transition-all duration-300 tracking-wide hover:bg-gold hover:text-royal-purple hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]" onClick={scrollToContact}>Book Site Visit</button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="bg-cream py-16 md:py-24" ref={(el) => { sectionsRef.current[1] = el }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Why Choose SKA DIVINE?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {[
              { icon: '💰', title: 'Competitive Pricing', desc: 'Starting from ₹1.2 Cr with flexible payment plans' },
              { icon: '🏠', title: 'Spacious Units', desc: '2BHK & 3BHK apartments ranging from 1200-1800 sq.ft' },
              { icon: '🏊', title: 'Premium Amenities', desc: 'World-class facilities including pool, gym, and clubhouse' },
              { icon: '📍', title: 'Prime Location', desc: 'Close to metro, schools, malls, and IT hubs' },
              { icon: '🔒', title: 'RERA Approved', desc: 'Fully compliant with all regulatory requirements' },
              { icon: '📅', title: 'Early Possession', desc: 'Ready to move in by Q2 2025' },
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-10 rounded-xl text-center shadow-[0_4px_20px_rgba(46,26,71,0.15)] transition-all duration-300 border border-gold/30 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-gold before:to-soft-gold-glow before:rounded-t-xl hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_20px_rgba(212,175,55,0.2)] hover:border-gold">
                <div className="text-4xl md:text-5xl mb-4 drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">{item.icon}</div>
                <h3 className="font-heading text-lg md:text-xl mb-3 text-royal-purple">{item.title}</h3>
                <p className="text-text-light text-sm md:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-gradient-to-b from-white to-cream py-16 md:py-24" ref={(el) => { sectionsRef.current[2] = el }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Gallery</h2>
          <div className="max-w-4xl mx-auto relative">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-gold shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_30px_rgba(212,175,55,0.3)] bg-royal-purple">
              <button 
                className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-royal-purple/80 border-2 border-gold text-gold text-2xl md:text-3xl font-bold cursor-pointer flex items-center justify-center transition-all duration-300 backdrop-blur-sm hover:bg-gold hover:text-royal-purple hover:scale-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                onClick={prevSlide} 
                aria-label="Previous slide"
              >
                ‹
              </button>
              <div 
                className="relative w-full h-full overflow-hidden"
                onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
                onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                onTouchEnd={() => {
                  if (!touchStart || !touchEnd) return
                  const distance = touchStart - touchEnd
                  const isLeftSwipe = distance > 50
                  const isRightSwipe = distance < -50
                  
                  if (isLeftSwipe) {
                    nextSlide()
                  } else if (isRightSwipe) {
                    prevSlide()
                  }
                }}
              >
                {galleryItems.map((item, index) => (
                  <div
                    key={index}
                    className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {item.type === 'video' ? (
                      <>
                        <video
                          ref={(el) => { carouselVideoRefs.current[index] = el }}
                          className="w-full h-full object-cover block"
                          src={item.src}
                          loop
                          muted
                          playsInline
                          onError={(e) => {
                            const target = e.target as HTMLVideoElement
                            target.style.display = 'none'
                            const placeholder = target.nextElementSibling as HTMLElement
                            if (placeholder) placeholder.style.display = 'flex'
                          }}
                        />
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${item.placeholder === 'interior' ? 'from-deep-purple to-[#5A3C7A]' : 'from-[#1a0f2e] to-deep-purple'} text-gold text-lg md:text-xl lg:text-2xl font-semibold font-heading text-center relative overflow-hidden`} style={{ display: 'none' }}>
                          {item.title}
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          className="w-full h-full object-cover block"
                          src={item.src}
                          alt={item.title}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const placeholder = target.nextElementSibling as HTMLElement
                            if (placeholder) placeholder.style.display = 'flex'
                          }}
                        />
                        <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${
                          item.placeholder === 'exterior' ? 'from-royal-purple to-[#4A2C6A]' :
                          item.placeholder === 'amenities' ? 'from-[#3A235A] to-royal-purple' :
                          item.placeholder === 'lobby' ? 'from-royal-purple to-[#2E1A47]' :
                          item.placeholder === 'kitchen' ? 'from-deep-purple to-[#4A2C6A]' :
                          'from-royal-purple to-deep-purple'
                        } text-gold text-lg md:text-xl lg:text-2xl font-semibold font-heading text-center relative overflow-hidden`} style={{ display: 'none' }}>
                          {item.title}
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-royal-purple/90 to-transparent p-8 text-gold text-center">
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl font-semibold m-0 text-shadow-gold">{item.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-royal-purple/80 border-2 border-gold text-gold text-2xl md:text-3xl font-bold cursor-pointer flex items-center justify-center transition-all duration-300 backdrop-blur-sm hover:bg-gold hover:text-royal-purple hover:scale-110 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]" 
                onClick={nextSlide} 
                aria-label="Next slide"
              >
                ›
              </button>
            </div>
            <div className="flex justify-center gap-3 mt-8">
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full border-2 border-gold cursor-pointer transition-all duration-300 p-0 ${
                    index === currentSlide 
                      ? 'bg-gold shadow-[0_0_10px_rgba(212,175,55,0.6)] scale-[1.3]' 
                      : 'bg-transparent hover:bg-gold/50 hover:scale-120'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Floor Plans & Site Map Section */}
      <section className="bg-cream py-16 md:py-24" ref={(el) => { sectionsRef.current[3] = el }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-center mb-6 md:mb-8 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Floor plans & site map</h2>
          
          {/* Toggle */}
          <div className="flex justify-start mb-8 md:mb-12">
            <div className="flex gap-2 bg-white rounded-lg p-1 border-2 border-gold/30 shadow-[0_4px_20px_rgba(46,26,71,0.15)]">
              <button
                onClick={() => setShowFloorPlans(true)}
                className={`px-6 py-2 md:px-8 md:py-2.5 rounded-md font-heading font-semibold text-sm md:text-base transition-all duration-300 ${
                  showFloorPlans
                    ? 'bg-gold text-royal-purple shadow-[0_2px_8px_rgba(212,175,55,0.3)]'
                    : 'bg-transparent text-royal-purple hover:text-gold'
                }`}
              >
                Floor Plans
              </button>
              <button
                onClick={() => setShowFloorPlans(false)}
                className={`px-6 py-2 md:px-8 md:py-2.5 rounded-md font-heading font-semibold text-sm md:text-base transition-all duration-300 ${
                  !showFloorPlans
                    ? 'bg-gold text-royal-purple shadow-[0_2px_8px_rgba(212,175,55,0.3)]'
                    : 'bg-transparent text-royal-purple hover:text-gold'
                }`}
              >
                Site Map
              </button>
            </div>
          </div>

          {/* Floor Plans Content */}
          {showFloorPlans && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { type: '3 BHK + 3T', area: '1855 sq.ft', plan: '3 BHK + 3T Floor Plan' },
                { type: '3 BHK + 4T + S', area: '2242 sq.ft', plan: '3 BHK + 4T + S Floor Plan' },
                { type: '4 BHK + 5T + S', area: '2962 sq.ft', plan: '4 BHK + 5T + S Floor Plan' },
              ].map((plan, idx) => (
                <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(46,26,71,0.15)] transition-all duration-300 border border-gold/30 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_20px_rgba(212,175,55,0.2)] hover:border-gold">
                  <div className="w-full aspect-[4/3] bg-cream relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-gold/10 before:to-transparent">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-royal-purple to-deep-purple text-gold text-base md:text-xl font-semibold font-heading px-4 text-center">{plan.plan}</div>
                  </div>
                  <div className="p-6 md:p-10 text-center">
                    <h3 className="font-heading text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 text-royal-purple">{plan.type}</h3>
                    <p className="text-text-light mb-4 md:mb-6 text-sm md:text-base lg:text-lg">{plan.area}</p>
                    <button className="px-6 md:px-8 py-2.5 md:py-3.5 bg-transparent text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-xs md:text-sm lg:text-base cursor-pointer transition-all duration-300 tracking-wide hover:bg-deep-purple hover:text-gold hover:border-gold">Download Floor Plan</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Site Map Content */}
          {!showFloorPlans && (
            <div className="w-full">
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(46,26,71,0.15)] border border-gold/30">
                <div className="w-full aspect-[4/3] bg-cream flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-royal-purple to-deep-purple text-gold text-lg md:text-xl lg:text-2xl font-semibold font-heading text-center px-4">
                    Site Map Image
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="py-16 md:py-24" ref={(el) => { sectionsRef.current[4] = el }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {
            [
              { icon: amenity1, text: 'Gym & Fitness' },
              { icon: amenity2, text: 'Swimming Pool' },
              { icon: amenity3, text: 'Clubhouse' },
              { icon: amenity4, text: 'Parking' },
              { icon: amenity5, text: 'Power Backup' },
              { icon: amenity6, text: '24/7 Security' },
              { icon: amenity7, text: 'Landscaped Gardens' },
              { icon: amenity8, text: 'Sports Facilities' },
            ].map((amenity, idx) => (
              <div key={idx} className="relative w-full aspect-square rounded-xl bg-[#332363] p-4 md:p-6 flex flex-col items-center justify-start pt-6 md:pt-8 transition-all duration-300 border border-gold/30 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_15px_rgba(212,175,55,0.2)] hover:border-gold">
                <img src={amenity.icon} alt={amenity.text} className="w-3/4 h-auto object-contain mb-3 md:mb-4"/>
                <span className="text-gold font-heading text-sm md:text-base text-center">{amenity.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-cream py-16 md:py-24" ref={(el) => { sectionsRef.current[5] = el }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div className="w-full h-[500px] rounded-xl overflow-hidden border-2 border-gold shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_15px_rgba(212,175,55,0.3)]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7001.696304408544!2d77.493954!3d28.664265!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf3df5f3a7353%3A0x90cc0c1edd953846!2sSKA%20Divine!5e0!3m2!1sen!2sin!4v1764705867665!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="SKA Divine Location"
                className="w-full h-full border-none rounded-xl"
              ></iframe>
            </div>
            <div className="bg-gradient-to-br from-royal-purple to-deep-purple p-10 rounded-xl shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_20px_rgba(212,175,55,0.2)] border-2 border-gold relative overflow-hidden h-[500px] flex flex-col before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.05)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,223,165,0.03)_0%,transparent_50%)] before:pointer-events-none before:z-[1]">
              <h3 className="font-heading text-2xl md:text-3xl mb-8 md:mb-10 text-gold text-center relative z-[1] tracking-wide text-shadow-gold">Location Advantages</h3>
              <div className="overflow-y-auto flex-1 pr-2 relative z-[1] scrollbar-hide">
                {[
                  { title: 'Transport', items: ['✈️ Nearby Upcoming Jewar Airport', '🛣️ Eastern Peripheral Expressway (06 Mins)', '📍 Noida Sec- 62 (15 Mins)', '🚂 Ghaziabad Railway Station (20 Mins)', '🚇 Shaheed Sthal Metro Station (20 Mins)', '🏛️ Akshardham (30 Mins)'] },
                  { title: 'Schools', items: ['🏫 DPS School', '🏫 Ryan International School', '🏫 St. Xavier\'s High School', '🏫 Hi-Tech World School'] },
                  { title: 'Hospitals', items: ['🏥 Manipal Hospital', '🏥 Yashoda Hospital', '🏥 Sarvodaya Hospital'] },
                  { title: 'Colleges', items: ['🎓 Hi-Tech Institute of Engineering & Technology', '🎓 IMS Ghaziabad (University Courses Campus)', '🎓 ABES Engineering College'] },
                  { title: 'Shopping Malls', items: ['🛍️ The Opulent Mall', '🛍️ Gaur City Mall'] },
                ].map((category, idx) => (
                  <div key={idx} className="mb-8 relative z-[1] last:mb-0">
                    <h4 className="font-heading text-base md:text-lg font-semibold text-royal-purple bg-gold px-4 md:px-5 py-2.5 md:py-3 mb-3 md:mb-4 rounded-md tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.2)]">{category.title}</h4>
                    <ul className="list-none p-0 m-0">
                      {category.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="py-2.5 md:py-3.5 pl-5 md:pl-6 border-b border-gold/20 text-sm md:text-base text-soft-gold-glow transition-all duration-300 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gold before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 hover:pl-7 md:hover:pl-8 hover:text-gold hover:translate-x-1 hover:before:opacity-100 last:border-b-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-12" ref={(el) => { sectionsRef.current[6] = el }}>
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Pricing</h2>
          <p className="text-center text-text-light text-sm md:text-base italic mb-4">*Prices are subject to change. Contact us for current rates and availability.</p>
          <div className="text-center mt-0">
            <button className="px-8 md:px-10 py-2.5 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)]" onClick={() => openModal('pricing')}>Download Pricing PDF</button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-gradient-to-br from-[#1a0f2e] via-royal-purple to-deep-purple text-white relative overflow-hidden py-16 md:py-24" ref={(el) => { sectionsRef.current[7] = el }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,223,165,0.06)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-8 relative z-[1]">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4 text-gold relative z-[1] tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent">Get in Touch</h2>
          <p className="text-center text-soft-gold-glow mb-6 md:mb-8 text-base md:text-lg relative z-[1]">Fill out the form below and we'll get back to you shortly</p>
          <form className="max-w-2xl mx-auto flex flex-col gap-6 relative z-[1]" onSubmit={handleSubmit} noValidate>
            <div className="w-full relative">
              <input
                type="text"
                name="name"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg bg-cream text-royal-purple text-sm md:text-base font-body transition-all duration-300 resize-y block opacity-100 visible ${
                  formErrors.name ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                }`}
              />
              {formErrors.name && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.name}</span>}
            </div>
            <div className="w-full relative">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg bg-cream text-royal-purple text-sm md:text-base font-body transition-all duration-300 resize-y block opacity-100 visible ${
                  formErrors.phone ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                }`}
              />
              {formErrors.phone && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.phone}</span>}
            </div>
            <div className="w-full relative">
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg bg-cream text-royal-purple text-sm md:text-base font-body transition-all duration-300 resize-y block opacity-100 visible ${
                  formErrors.email ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                }`}
              />
              {formErrors.email && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.email}</span>}
            </div>
            <div className="w-full relative">
              <textarea
                name="message"
                placeholder="Your Message (Optional)"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 resize-y block opacity-100 visible min-h-[120px] leading-relaxed ${
                  formErrors.message ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                }`}
              />
              {formErrors.message && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.message}</span>}
            </div>
            <button type="submit" className="px-8 md:px-10 py-3 md:py-4 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-base md:text-lg cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Request Callback'}
            </button>
          </form>

          {/* Modal for PDF Downloads */}
          {showModal && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-[fadeIn_0.3s_ease-out]" onClick={closeModal}>
              <div className="bg-gradient-to-br from-royal-purple to-deep-purple border-2 border-gold rounded-2xl p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)] animate-[slideUp_0.3s_ease-out] scrollbar-hide" onClick={(e) => e.stopPropagation()}>
                <button className="absolute top-4 right-4 bg-transparent border-2 border-gold text-gold w-9 h-9 rounded-full text-2xl cursor-pointer flex items-center justify-center transition-all duration-300 leading-none p-0 hover:bg-gold hover:text-royal-purple hover:rotate-90" onClick={closeModal}>&times;</button>
                <h3 className="font-heading text-2xl md:text-3xl text-gold text-center mb-2 tracking-wide">
                  {modalType === 'brochure' ? 'Download Brochure' : 'Download Pricing PDF'}
                </h3>
                <p className="text-center text-soft-gold-glow mb-6 md:mb-8 text-sm md:text-base">Please fill in your details to download</p>
                <form className="flex flex-col gap-6" onSubmit={handleModalSubmit} noValidate>
                  <div className="w-full relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 ${
                        formErrors.name ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                      }`}
                    />
                    {formErrors.name && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.name}</span>}
                  </div>
                  <div className="w-full relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 ${
                        formErrors.phone ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                      }`}
                    />
                    {formErrors.phone && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.phone}</span>}
                  </div>
                  <div className="w-full relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 ${
                        formErrors.email ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                      }`}
                    />
                    {formErrors.email && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.email}</span>}
                  </div>
                  <div className="w-full relative">
                    <textarea
                      name="message"
                      placeholder="Your Message (Optional)"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 min-h-[120px] leading-relaxed ${
                        formErrors.message ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]' : 'border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white'
                      }`}
                    />
                    {formErrors.message && <span className="block text-red-300 text-sm mt-2 italic">{formErrors.message}</span>}
                  </div>
                  <button type="submit" className="px-8 md:px-10 py-3 md:py-4 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-base md:text-lg cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : 'Download'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-royal-purple to-[#1a0f2e] text-white py-16 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 mb-12">
            <div>
              <h3 className="font-heading text-2xl md:text-3xl mb-4 md:mb-6 text-gold">SKA DIVINE</h3>
              <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">Premium residential project by SKA Developers</p>
            </div>
            <div>
              <h4 className="font-heading text-lg md:text-xl mb-4 md:mb-6 text-soft-gold-glow">Contact</h4>
              <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">📞 +91 98765 43210</p>
              <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">✉️ info@skadivine.com</p>
              <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">📍 Prime Downtown, City</p>
            </div>
      <div>
              <h4 className="font-heading text-lg md:text-xl mb-4 md:mb-6 text-soft-gold-glow">Quick Links</h4>
              <ul className="list-none">
                <li className="mb-3">
                  <a 
                    href="#highlights" 
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('highlights'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                  >
                    Highlights
                  </a>
                </li>
                <li className="mb-3">
                  <a 
                    href="#gallery" 
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('gallery'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                  >
                    Gallery
                  </a>
                </li>
                <li className="mb-3">
                  <a 
                    href="#amenities" 
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('amenities'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                  >
                    Amenities
                  </a>
                </li>
                <li className="mb-3">
                  <a 
                    href="#pricing" 
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('pricing'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gold/20">
            <p className="text-white/70 text-xs md:text-sm mb-2">&copy; 2024 SKA DIVINE. All rights reserved.</p>
            <p className="text-white/60 text-xs">*Images are for representation purposes only. Actual product may vary.</p>
          </div>
      </div>
      </footer>
      </div>
  )
}

export default App
