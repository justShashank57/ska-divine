import { useState, useEffect, useRef, type CSSProperties, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";
import ThanksPage from "./ThanksPage";
import { debounce, throttle } from "./utils/debounce";
import { useVideoOptimization, getVideoPreloadStrategy } from "./utils/videoOptimization";
import skaIntroVideo from "./assets/skaIntro.mp4";
import phoneBGVideo from "./assets/phoneBG.mp4";
import consUpdateVideo from "./assets/cons_update.MP4";
import amenity1 from "./assets/amenities/1.png";
import amenity2 from "./assets/amenities/2.png";
import amenity3 from "./assets/amenities/3.png";
import amenity4 from "./assets/amenities/4.png";
import amenity5 from "./assets/amenities/5.png";
import amenity6 from "./assets/amenities/6.png";
import amenity7 from "./assets/amenities/7.png";
import amenity8 from "./assets/amenities/8.png";
import sitemap from "./assets/floor_sitemap/sitemap.png";
import floorPlan1 from "./assets/floor_sitemap/1.png";
import floorPlan2 from "./assets/floor_sitemap/2.png";
import floorPlan3 from "./assets/floor_sitemap/3.png";
import info from "./assets/gallery/info.png";
import info2 from "./assets/gallery/about.jpg";
import brochurePDF from "./assets/brochure.pdf";
import pricePDF from "./assets/price_2025.pdf";
import gallery1 from "./assets/gallery/gallery-1.jpg";
import gallery2 from "./assets/gallery/gallery-2.jpg";
import gallery3 from "./assets/gallery/gallery-3.jpg";
import gallery4 from "./assets/gallery/gallery-4.jpg";
import gallery5 from "./assets/gallery/gallery-5.jpg";
import gallery6 from "./assets/gallery/gallery-6.jpg";
import gallery7 from "./assets/gallery/gallery-7.jpg";
import gallery8 from "./assets/gallery/gallery-8.jpg";
import gallery9 from "./assets/gallery/gallery-9.png";
import gallery10 from "./assets/gallery/gallery-10.png";
import gallery11 from "./assets/gallery/gallery-11.png";
import gallery12 from "./assets/gallery/gallery-12.png";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"brochure" | "pricing" | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showFloorPlans, setShowFloorPlans] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showBankTooltip, setShowBankTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, right: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const consUpdateVideoRef = useRef<HTMLVideoElement | null>(null);
  const tooltipButtonRef = useRef<HTMLButtonElement>(null);

  // Video optimization hooks
  const heroVideoOptimization = useVideoOptimization({
    videoRef,
    autoPlay: true,
    observerThreshold: 0.5,
  });

  const consVideoOptimization = useVideoOptimization({
    videoRef: consUpdateVideoRef,
    autoPlay: false, // Don't auto-play construction update video
    observerThreshold: 0.3,
  });

  const heroVideoPreload = getVideoPreloadStrategy(isMobile, true); // Hero is above-the-fold

  // Memoized gallery items to prevent recreation on every render
  const galleryItems = useMemo(() => [
    { type: "image", src: gallery1, title: "Gallery View 1" },
    { type: "image", src: gallery2, title: "Gallery View 2" },
    { type: "image", src: gallery3, title: "Gallery View 3" },
    { type: "image", src: gallery4, title: "Gallery View 4" },
    { type: "image", src: gallery5, title: "Gallery View 5" },
    { type: "image", src: gallery6, title: "Gallery View 6" },
    { type: "image", src: gallery7, title: "Gallery View 7" },
    { type: "image", src: gallery8, title: "Gallery View 8" },
    { type: "image", src: gallery9, title: "Gallery View 9" },
    { type: "image", src: gallery10, title: "Gallery View 10" },
    { type: "image", src: gallery11, title: "Gallery View 11" },
    { type: "image", src: gallery12, title: "Gallery View 12" },
  ], []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === galleryItems.length - 1 ? 0 : prev + 1
    );
  }, [galleryItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) =>
      prev === 0 ? galleryItems.length - 1 : prev - 1
    );
  }, [galleryItems.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Keyboard navigation for carousel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle if gallery section is in view
      const gallerySection = document.getElementById("gallery");
      if (!gallerySection) return;

      const rect = gallerySection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInView) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setCurrentSlide((prev) =>
            prev === 0 ? galleryItems.length - 1 : prev - 1
          );
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setCurrentSlide((prev) =>
            prev === galleryItems.length - 1 ? 0 : prev + 1
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [galleryItems.length]);

  // Handle scroll for sticky button with throttle
  useEffect(() => {
    const handleScroll = throttle(() => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 300);
    }, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Detect screen size for video selection with debounce
  useEffect(() => {
    const checkScreenSize = debounce(() => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    }, 250);

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Video playback optimization - Only called once on mount
  useEffect(() => {
    if (videoRef.current) {
      // Video will be auto-played by Intersection Observer
      videoRef.current.load();
    }
    if (consUpdateVideoRef.current) {
      // Construction video loads metadata only
      consUpdateVideoRef.current.load();
    }
  }, [isMobile]);

  // Route-based scroll handler
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === "/") return;

    const sectionId = pathname.slice(1); // Remove leading slash
    const section = document.getElementById(sectionId);

    if (section) {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location.pathname]);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const scrollToContact = useCallback(() => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const validateForm = useCallback(() => {
    const errors = {
      name: "",
      phone: "",
      email: "",
      message: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Please enter a valid 10-digit phone number";
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  }, [formData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error when user starts typing
      if (formErrors[name as keyof typeof formErrors]) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [formErrors]
  );

  const sendEmail = useCallback(
    async (
      data: typeof formData,
      _type: "contact" | "brochure" | "pricing"
    ) => {
      const templateParams = {
        from_name: data.name,
        email_id: data.email,
        phone_number: data.phone,
        message: data.message || "",
      };

      try {
        await emailjs.send(
          "service_aaa8luj",
          "template_49qje2t",
          templateParams,
          "Gij9riEgS7KzS2Gsx"
        );
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const downloadPDF = useCallback((type: "brochure" | "pricing") => {
    const link = document.createElement("a");
    link.href = type === "brochure" ? brochurePDF : pricePDF;
    link.download =
      type === "brochure"
        ? "SKA-Divine-Brochure.pdf"
        : "SKA-Divine-Price-2025.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await sendEmail(formData, "contact");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setFormErrors({ name: "", phone: "", email: "", message: "" });
        navigate("/thanks");
      } catch (error) {
        alert("There was an error submitting the form. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, navigate]
  );

  const handleModalSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (modalType) {
          await sendEmail(formData, modalType);
          downloadPDF(modalType);
          setShowModal(false);
          setModalType(null);
          setFormData({ name: "", phone: "", email: "", message: "" });
          setFormErrors({ name: "", phone: "", email: "", message: "" });
          alert("Thank you! Your download will begin shortly.");
        }
      } catch (error) {
        alert("There was an error. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, modalType, validateForm]
  );

  const openModal = useCallback((type: "brochure" | "pricing") => {
    setModalType(type);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalType(null);
    setFormData({ name: "", phone: "", email: "", message: "" });
    setFormErrors({ name: "", phone: "", email: "", message: "" });
  }, []);

  return (
    <>
      <div className="w-full overflow-x-hidden">
        <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        {/* Sticky Book Site Visit Button */}
        <button
          className={`fixed top-4 right-4 md:top-8 md:right-8 z-[1000] px-6 py-2.5 md:px-8 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-full font-heading font-semibold text-xs md:text-sm cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4),0_4px_15px_rgba(0,0,0,0.2)] transition-all duration-300 tracking-wide ${
            isScrolled
              ? "opacity-100 visible scale-100 translate-y-0"
              : "opacity-0 invisible scale-90 -translate-y-5"
          } hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_6px_20px_rgba(0,0,0,0.3)] active:translate-y-0 active:scale-100`}
          onClick={scrollToContact}
          aria-label="Book Site Visit"
        >
          <span>Book Site Visit</span>
        </button>

        {/* Hero Section */}
        <section
          className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0f2e] via-royal-purple to-deep-purple text-white text-center p-8 overflow-hidden"
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
        >
          <video
            key={isMobile ? "phone" : "desktop"}
            ref={videoRef}
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover z-0 brightness-[0.9] contrast-[1.1] saturate-[1.1] pointer-events-none backface-hidden will-change-transform opacity-70 md:opacity-70 opacity-65"
            autoPlay={false}
            loop
            muted
            playsInline
            preload={heroVideoPreload}
            onError={heroVideoOptimization.handleVideoError}
          >
            <source src={isMobile ? phoneBGVideo : skaIntroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Gold particles effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,223,165,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none z-[1]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/25 via-deep-purple/20 to-[#1a0f2e]/25 z-[2]"></div>
          <div className="relative z-[3] max-w-4xl animate-[fadeInUp_0.8s_ease-out]">
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 tracking-wider text-gold text-shadow-gold">
              SKA DIVINE
            </h1>
            <p className="font-body text-lg md:text-2xl mb-12 opacity-95 italic text-soft-gold-glow">
              Luxury Living Redefined in the Heart of the City
            </p>
            <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:gap-8 mb-12 p-6 md:p-10 bg-royal-purple/75 backdrop-blur-[20px] rounded-2xl border-2 border-gold/50 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)]">
              <div className="flex flex-col gap-2">
                <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">
                  Price Range
                </span>
                <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">
                  ₹1.6 Cr - ₹2.5 Cr
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">
                  Location
                </span>
                <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">
                  Wave City GZBD
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">
                  RERA
                </span>
                <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">
                  RERA Approved
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs md:text-sm opacity-85 uppercase tracking-widest text-soft-gold-glow font-heading">
                  Possession
                </span>
                <span className="text-base md:text-lg lg:text-xl font-semibold text-gold font-heading">
                  2029
                </span>
              </div>
            </div>
            <div className="flex gap-6 justify-center flex-wrap">
              <button
                className="px-8 md:px-10 py-2.5 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)]"
                onClick={() => openModal("brochure")}
              >
                Download Brochure
              </button>
              <button
                className="px-8 md:px-10 py-2.5 md:py-3.5 bg-transparent text-gold border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer transition-all duration-300 tracking-wide hover:bg-gold hover:text-royal-purple hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                onClick={scrollToContact}
              >
                Book Site Visit
              </button>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section
          id="highlights"
          className="bg-cream py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
        >
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Why Choose SKA DIVINE?
            </h2>
            <p className="text-center text-text-light max-w-3xl mx-auto mb-12 md:mb-16 text-base md:text-lg">
              Luxury 3BHK/4BHK Apartments in Ghaziabad - New Launch Residential
              Project | Best Investment Property in NH-24 Ghaziabad | EV
              Charging Apartments
            </p>
            <div className="space-y-10 md:space-y-14">
              {[
                {
                  image: info,
                  items: [
                    {
                      title: "Residence Mix",
                      desc: "3/4BHK luxurious apartments.",
                    },
                    {
                      title: "Regulatory Clarity",
                      desc: "UP RERA No. UPRERAPRJ556045/10/2024.",
                    },
                    {
                      title: "Land Canvas",
                      desc: "Spread over approx 5 acres.",
                    },
                    {
                      title: "Trust & Finance",
                      desc: "Land approved by leading banks & NBFCs.",
                    },
                    {
                      title: "Skyline",
                      desc: "3 majestic towers, 27 storeys high.",
                    },
                  ],
                },
                {
                  image: info2,
                  items: [
                    {
                      title: "Lifestyle Volume",
                      desc: "1,26,000 sq. ft. club, landscaping & swimming pool.",
                    },
                    {
                      title: "Connected Living",
                      desc: "Seamless connectivity via Delhi-Meerut Expressway.",
                    },
                    {
                      title: "Sustainability",
                      desc: "Pre-certified platinum-rated green township.",
                    },
                    {
                      title: "Structural Assurance",
                      desc: "Earthquake-resistant frame structure.",
                    },
                    {
                      title: "Society Shops",
                      desc: "13 society double story shops with 23ft ceiling height.",
                    },
                    { title: "Timeline", desc: "Possession 2029." },
                  ],
                },
              ].map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-8 md:gap-12 items-center ${
                    rowIdx % 2 === 1
                      ? "md:[&>div:first-child]:order-2 md:[&>div:last-child]:order-1"
                      : ""
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-royal-purple/10 shadow-[0_18px_60px_rgba(46,26,71,0.15)]">
                    <div className="min-h-[320px] md:min-h-[440px] bg-royal-purple/10">
                      <img
                        src={row.image}
                        alt="SKA Divine residence"
                        className="h-full w-full object-cover scale-[1.3]"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 md:gap-4">
                    {row.items.map((item, idx) => {
                      const textStyle: CSSProperties = {
                        animation: `fadeSlide 0.45s ease-out ${
                          idx * 80
                        }ms both`,
                      };
                      const isTrustFinance = item.title === "Trust & Finance";
                      const banks = [
                        "SBI",
                        "ICICI",
                        "HDFC",
                        "PNB",
                        "BOB",
                        "CANARA",
                        "NBFC",
                        "AXIS",
                      ];
                      return (
                        <div
                          key={idx}
                          className="relative pl-6 md:pl-8 py-3 md:py-4 border-l-2 border-gold/80"
                        >
                          <div
                            className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                            style={textStyle}
                          >
                            <span className="font-heading text-sm tracking-[0.18em] uppercase text-royal-purple">
                              {item.title}
                            </span>
                            <div className="relative flex items-center gap-2 sm:text-right">
                              <p className="font-body text-base md:text-lg text-royal-purple leading-relaxed">
                                {item.desc.replace(/\?/g, "")}
                              </p>
                              {isTrustFinance && (
                                <div className="relative">
                                  <button
                                    ref={tooltipButtonRef}
                                    className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gold text-royal-purple flex items-center justify-center text-xs md:text-sm font-bold cursor-pointer hover:bg-royal-purple hover:text-gold transition-all duration-300 shadow-[0_2px_8px_rgba(212,175,55,0.4)] hover:scale-110"
                                    aria-label="View approved banks"
                                    onMouseEnter={() => {
                                      if (tooltipButtonRef.current) {
                                        const rect =
                                          tooltipButtonRef.current.getBoundingClientRect();
                                        setTooltipPosition({
                                          top: rect.bottom + 8,
                                          right: window.innerWidth - rect.right,
                                        });
                                        setShowBankTooltip(true);
                                      }
                                    }}
                                    onMouseLeave={() => setShowBankTooltip(false)}
                                    onTouchStart={() => {
                                      if (tooltipButtonRef.current) {
                                        const rect =
                                          tooltipButtonRef.current.getBoundingClientRect();
                                        setTooltipPosition({
                                          top: rect.bottom + 8,
                                          right: window.innerWidth - rect.right,
                                        });
                                        setShowBankTooltip(!showBankTooltip);
                                      }
                                    }}
                                  >
                                    ?
                                  </button>
                                  {showBankTooltip &&
                                    typeof document !== "undefined" &&
                                    createPortal(
                                      <div
                                        className="fixed z-[100000] bg-gradient-to-br from-royal-purple to-deep-purple border-2 border-gold rounded-lg p-4 shadow-[0_10px_40px_rgba(46,26,71,0.3),0_0_15px_rgba(212,175,55,0.4)] min-w-[200px] md:min-w-[250px] animate-[slideUp_0.2s_ease-out]"
                                        style={{
                                          top: `${tooltipPosition.top}px`,
                                          right: `${tooltipPosition.right}px`,
                                        }}
                                        onMouseEnter={() =>
                                          setShowBankTooltip(true)
                                        }
                                        onMouseLeave={() =>
                                          setShowBankTooltip(false)
                                        }
                                      >
                                        <h5 className="font-heading text-sm md:text-base text-gold mb-3 font-semibold">
                                          Approved Banks & NBFCs:
                                        </h5>
                                        <ul className="list-none space-y-1.5">
                                          {banks.map((bank, bankIdx) => (
                                            <li
                                              key={bankIdx}
                                              className="text-soft-gold-glow text-sm md:text-base font-body flex items-center gap-2"
                                            >
                                              <span className="text-gold">
                                                •
                                              </span>
                                              {bank}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>,
                                      document.body
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          id="gallery"
          className="bg-gradient-to-b from-white to-cream py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
        >
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Gallery
            </h2>

            {/* Main Carousel Container */}
            <div className="relative">
              {/* Main Image Display */}
              <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden mb-8 border-2 border-gold/30 shadow-[0_20px_60px_rgba(46,26,71,0.2)] bg-royal-purple/5">
                <div
                  className="relative w-full h-full overflow-hidden"
                  onTouchStart={(e) =>
                    setTouchStart(e.targetTouches[0].clientX)
                  }
                  onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
                  onTouchEnd={() => {
                    if (!touchStart || !touchEnd) return;
                    const distance = touchStart - touchEnd;
                    const isLeftSwipe = distance > 50;
                    const isRightSwipe = distance < -50;

                    if (isLeftSwipe) {
                      nextSlide();
                    } else if (isRightSwipe) {
                      prevSlide();
                    }
                  }}
                >
                  {galleryItems.map((item, index) => (
                    <div
                      key={index}
                      className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
                      style={{
                        transform: `translateX(${
                          (index - currentSlide) * 100
                        }%)`,
                        opacity: index === currentSlide ? 1 : 0,
                        pointerEvents: index === currentSlide ? "auto" : "none",
                      }}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={item.src}
                        alt={item.title}
                        loading={index === currentSlide ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  className="absolute top-1/2 left-4 md:left-6 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-md border-2 border-gold text-royal-purple text-2xl md:text-3xl font-bold cursor-pointer flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-gold hover:text-royal-purple hover:scale-110 hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)]"
                  onClick={prevSlide}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  className="absolute top-1/2 right-4 md:right-6 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/90 backdrop-blur-md border-2 border-gold text-royal-purple text-2xl md:text-3xl font-bold cursor-pointer flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:bg-gold hover:text-royal-purple hover:scale-110 hover:shadow-[0_6px_30px_rgba(212,175,55,0.4)]"
                  onClick={nextSlide}
                  aria-label="Next slide"
                >
                  ›
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-gold/50 shadow-[0_4px_15px_rgba(0,0,0,0.15)]">
                  <span className="font-heading text-sm md:text-base text-royal-purple">
                    {currentSlide + 1} / {galleryItems.length}
                  </span>
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="relative overflow-hidden">
                <div
                  className="flex gap-3 md:gap-4 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(-${
                      currentSlide * (100 / Math.min(galleryItems.length, 8))
                    }%)`,
                  }}
                >
                  {galleryItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`flex-shrink-0 w-[calc(12.5%-0.75rem)] md:w-24 h-16 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                        index === currentSlide
                          ? "border-gold shadow-[0_4px_20px_rgba(212,175,55,0.4)] scale-105"
                          : "border-royal-purple/20 hover:border-gold/50 hover:scale-105 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View ${item.title}`}
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={item.src}
                        alt={item.title}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floor Plans & Site Map Section */}
        <section
          id="floorplans"
          className="bg-cream py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[3] = el;
          }}
        >
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-center mb-6 md:mb-8 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Floor plans & site map
            </h2>

            {/* Toggle */}
            <div className="flex justify-start mb-8 md:mb-12">
              <div className="flex gap-2 bg-white rounded-lg p-1 border-2 border-gold/30 shadow-[0_4px_20px_rgba(46,26,71,0.15)]">
                <button
                  onClick={() => setShowFloorPlans(true)}
                  className={`px-6 py-2 md:px-8 md:py-2.5 rounded-md font-heading font-semibold text-sm md:text-base transition-all duration-300 ${
                    showFloorPlans
                      ? "bg-gold text-royal-purple shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                      : "bg-transparent text-royal-purple hover:text-gold"
                  }`}
                >
                  Floor Plans
                </button>
                <button
                  onClick={() => setShowFloorPlans(false)}
                  className={`px-6 py-2 md:px-8 md:py-2.5 rounded-md font-heading font-semibold text-sm md:text-base transition-all duration-300 ${
                    !showFloorPlans
                      ? "bg-gold text-royal-purple shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                      : "bg-transparent text-royal-purple hover:text-gold"
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
                  {
                    type: "3 BHK + 3T",
                    area: "1855 sq.ft",
                    plan: "3 BHK + 3T Floor Plan",
                    image: floorPlan1,
                  },
                  {
                    type: "3 BHK + 4T + S",
                    area: "2242 sq.ft",
                    plan: "3 BHK + 4T + S Floor Plan",
                    image: floorPlan2,
                  },
                  {
                    type: "4 BHK + 5T + S",
                    area: "2962 sq.ft",
                    plan: "4 BHK + 5T + S Floor Plan",
                    image: floorPlan3,
                  },
                ].map((plan, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(46,26,71,0.15)] transition-all duration-300 border border-gold/30 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_20px_rgba(212,175,55,0.2)] hover:border-gold"
                  >
                    <div
                      className="w-full aspect-[4/3] bg-cream relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-gold/10 before:to-transparent cursor-pointer"
                      onClick={() => setFullscreenImage(plan.image)}
                    >
                      <img
                        src={plan.image}
                        alt={plan.plan}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 md:p-6 text-center">
                      <h3 className="font-heading text-lg md:text-xl lg:text-2xl mb-1 md:mb-2 text-royal-purple">
                        {plan.type}
                      </h3>
                      <p className="text-text-light text-xs md:text-sm lg:text-base">
                        {plan.area}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Site Map Content */}
            {!showFloorPlans && (
              <div className="w-full">
                <div className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(46,26,71,0.15)] border border-gold/30">
                  <div
                    className="w-full aspect-[4/3] bg-cream flex items-center justify-center cursor-pointer"
                    onClick={() => setFullscreenImage(sitemap)}
                  >
                    <img
                      src={sitemap}
                      alt="Site Map"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Amenities Section */}
        <section
          id="amenities"
          className="py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[4] = el;
          }}
        >
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { icon: amenity1, text: "Gym & Fitness" },
                { icon: amenity2, text: "Swimming Pool" },
                { icon: amenity3, text: "Clubhouse" },
                { icon: amenity4, text: "Parking" },
                { icon: amenity5, text: "Power Backup" },
                { icon: amenity6, text: "24/7 Security" },
                { icon: amenity7, text: "Landscaped Gardens" },
                { icon: amenity8, text: "Sports Facilities" },
              ].map((amenity, idx) => (
                <div
                  key={idx}
                  className="relative w-full aspect-square rounded-xl bg-[#332363] p-4 md:p-6 flex flex-col items-center justify-start pt-6 md:pt-8 transition-all duration-300 border border-gold/30 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_15px_rgba(212,175,55,0.2)] hover:border-gold"
                >
                  <img
                    src={amenity.icon}
                    alt={amenity.text}
                    className="w-3/4 h-auto object-contain mb-3 md:mb-4"
                  />
                  <span className="text-gold font-heading text-sm md:text-base text-center">
                    {amenity.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section
          id="pricing"
          className="py-12"
          ref={(el) => {
            sectionsRef.current[6] = el;
          }}
        >
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Pricing
            </h2>
            <p className="text-center text-text-light text-sm md:text-base italic mb-4">
              *Prices are subject to change. Contact us for current rates and
              availability.
            </p>
            <div className="text-center mt-0">
              <button
                className="px-8 md:px-10 py-2.5 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)]"
                onClick={() => openModal("pricing")}
              >
                Download Pricing PDF
              </button>
            </div>
          </div>
        </section>

        {/* Construction Update Section */}
        <section
          id="constructionUpdates"
          className="bg-cream py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[5] = el;
          }}
        >
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-6 md:mb-8 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Construction Update
            </h2>
            <div className="mb-8 md:mb-12 text-center max-w-4xl mx-auto">
              <p className="font-body text-base md:text-lg lg:text-xl text-text-light leading-relaxed mb-4">
                Witness the transformation of your dream home taking shape. Our
                commitment to excellence is reflected in every detail of
                construction, ensuring quality and precision at every stage.
              </p>
              <p className="font-body text-sm md:text-base text-text-light leading-relaxed italic">
                Experience the journey of SKA DIVINE coming to life, where
                luxury meets craftsmanship.
              </p>
            </div>
            <div className="w-full rounded-2xl overflow-hidden border-2 border-gold shadow-[0_10px_40px_rgba(46,26,71,0.25),0_0_15px_rgba(212,175,55,0.3)] bg-royal-purple/5">
              <div className="relative w-full aspect-video bg-royal-purple/10">
                <video
                  ref={consUpdateVideoRef}
                  className="w-full h-full object-cover"
                  controls
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onError={consVideoOptimization.handleVideoError}
                >
                  <source src={consUpdateVideo} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section
          id="location"
          className="bg-cream py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[6] = el;
          }}
        >
          <div className="max-w-6xl mx-auto px-8">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16 text-royal-purple tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent after:shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              Location
            </h2>
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
                <h3 className="font-heading text-2xl md:text-3xl mb-8 md:mb-10 text-gold text-center relative z-[1] tracking-wide text-shadow-gold">
                  Location Advantages
                </h3>
                <div className="overflow-y-auto flex-1 pr-2 relative z-[1] scrollbar-hide">
                  {[
                    {
                      title: "Transport",
                      items: [
                        "✈️ Nearby Upcoming Jewar Airport",
                        "🛣️ Eastern Peripheral Expressway (06 Mins)",
                        "📍 Noida Sec- 62 (15 Mins)",
                        "🚂 Ghaziabad Railway Station (20 Mins)",
                        "🚇 Shaheed Sthal Metro Station (20 Mins)",
                        "🏛️ Akshardham (30 Mins)",
                      ],
                    },
                    {
                      title: "Schools",
                      items: [
                        "🏫 DPS School",
                        "🏫 Ryan International School",
                        "🏫 St. Xavier's High School",
                        "🏫 Hi-Tech World School",
                      ],
                    },
                    {
                      title: "Hospitals",
                      items: [
                        "🏥 Manipal Hospital",
                        "🏥 Yashoda Hospital",
                        "🏥 Sarvodaya Hospital",
                      ],
                    },
                    {
                      title: "Colleges",
                      items: [
                        "🎓 Hi-Tech Institute of Engineering & Technology",
                        "🎓 IMS Ghaziabad (University Courses Campus)",
                        "🎓 ABES Engineering College",
                      ],
                    },
                    {
                      title: "Shopping Malls",
                      items: ["🛍️ The Opulent Mall", "🛍️ Gaur City Mall"],
                    },
                  ].map((category, idx) => (
                    <div key={idx} className="mb-8 relative z-[1] last:mb-0">
                      <h4 className="font-heading text-base md:text-lg font-semibold text-royal-purple bg-gold px-4 md:px-5 py-2.5 md:py-3 mb-3 md:mb-4 rounded-md tracking-wide shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                        {category.title}
                      </h4>
                      <ul className="list-none p-0 m-0">
                        {category.items.map((item, itemIdx) => (
                          <li
                            key={itemIdx}
                            className="py-2.5 md:py-3.5 pl-5 md:pl-6 border-b border-gold/20 text-sm md:text-base text-soft-gold-glow transition-all duration-300 relative before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-gold before:rounded-full before:opacity-0 before:transition-opacity before:duration-300 hover:pl-7 md:hover:pl-8 hover:text-gold hover:translate-x-1 hover:before:opacity-100 last:border-b-0"
                          >
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

        {/* Contact Form Section */}
        <section
          id="contact"
          className="bg-gradient-to-br from-[#1a0f2e] via-royal-purple to-deep-purple text-white relative overflow-hidden py-16 md:py-24"
          ref={(el) => {
            sectionsRef.current[8] = el;
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,223,165,0.06)_0%,transparent_50%)] pointer-events-none"></div>
          <div className="max-w-6xl mx-auto px-8 relative z-[1]">
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-4 text-gold relative z-[1] tracking-wide relative pb-4 md:pb-6 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-0.5 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent">
              Get in Touch
            </h2>
            <p className="text-center text-soft-gold-glow mb-6 md:mb-8 text-base md:text-lg relative z-[1]">
              Fill out the form below and we'll get back to you shortly
            </p>
            <form
              className="max-w-2xl mx-auto flex flex-col gap-6 relative z-[1]"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="w-full relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg bg-cream text-royal-purple text-sm md:text-base font-body transition-all duration-300 resize-y block opacity-100 visible ${
                    formErrors.name
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.name && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.name}
                  </span>
                )}
              </div>
              <div className="w-full relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg bg-cream text-royal-purple text-sm md:text-base font-body transition-all duration-300 resize-y block opacity-100 visible ${
                    formErrors.phone
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.phone && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.phone}
                  </span>
                )}
              </div>
              <div className="w-full relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 md:py-4 border-2 rounded-lg bg-cream text-royal-purple text-sm md:text-base font-body transition-all duration-300 resize-y block opacity-100 visible ${
                    formErrors.email
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.email && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="w-full relative">
                <textarea
                  name="message"
                  placeholder="Your Message (Optional)"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 resize-y block opacity-100 visible min-h-[120px] leading-relaxed ${
                    formErrors.message
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.message && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-8 md:px-10 py-3 md:py-4 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-base md:text-lg cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Callback"}
              </button>
            </form>

            {/* Modal for PDF Downloads */}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-b from-royal-purple to-[#1a0f2e] text-white py-16 relative before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-12 mb-12">
              <div>
                <h3 className="font-heading text-2xl md:text-3xl mb-4 md:mb-6 text-gold">
                  SKA DIVINE
                </h3>
                <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">
                  Premium residential project by SKA Developers
                </p>
              </div>
              <div>
                <h4 className="font-heading text-lg md:text-xl mb-4 md:mb-6 text-soft-gold-glow">
                  Contact
                </h4>
                <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">
                  📞 +91 8700154680
                </p>
                <p className="text-white/85 mb-3 leading-relaxed text-sm md:text-base">
                  📍 Plot no. G.H-2, Sector 1, Wave City, Ghaziabad
                </p>
              </div>
              <div>
                <h4 className="font-heading text-lg md:text-xl mb-4 md:mb-6 text-soft-gold-glow">
                  Quick Links
                </h4>
                <ul className="list-none">
                  <li className="mb-3">
                    <a
                      href="#highlights"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("highlights");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                    >
                      Highlights
                    </a>
                  </li>
                  <li className="mb-3">
                    <a
                      href="#gallery"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("gallery");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                    >
                      Gallery
                    </a>
                  </li>
                  <li className="mb-3">
                    <a
                      href="#amenities"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("amenities");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                    >
                      Amenities
                    </a>
                  </li>
                  <li className="mb-3">
                    <a
                      href="#pricing"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("pricing");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-white/85 no-underline transition-all duration-300 relative pl-0 hover:text-gold hover:pl-4 before:content-['→'] before:text-gold before:mr-2 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100"
                    >
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center pt-8 border-t border-gold/20">
              <p className="text-white/70 text-xs md:text-sm mb-2">
                &copy; 2024 SKA DIVINE. All rights reserved.
              </p>
              <p className="text-white/60 text-xs">
                *Images are for representation purposes only. Actual product may
                vary.
              </p>
            </div>
          </div>
        </footer>

        {/* Fullscreen Image Popup */}
        {fullscreenImage && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-[fadeIn_0.3s_ease-out]"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              className="absolute top-4 right-4 bg-transparent border-2 border-gold text-gold w-10 h-10 md:w-12 md:h-12 rounded-full text-2xl md:text-3xl cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-gold hover:text-royal-purple hover:rotate-90 z-[100000]"
              onClick={() => setFullscreenImage(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <div
              className="max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={fullscreenImage}
                alt="Floor Plan"
                className="max-w-full max-h-full object-contain rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)]"
              />
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-[999999] p-4 animate-[fadeIn_0.3s_ease-out] h-screen"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-royal-purple to-deep-purple border-2 border-gold rounded-2xl p-10 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)] animate-[slideUp_0.3s_ease-out] scrollbar-hide"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 bg-transparent border-2 border-gold text-gold w-9 h-9 rounded-full text-2xl cursor-pointer flex items-center justify-center transition-all duration-300 leading-none p-0 hover:bg-gold hover:text-royal-purple hover:rotate-90"
              onClick={closeModal}
            >
              &times;
            </button>
            <h3 className="font-heading text-2xl md:text-3xl text-gold text-center mb-2 tracking-wide">
              {modalType === "brochure"
                ? "Download Brochure"
                : "Download Pricing PDF"}
            </h3>
            <p className="text-center text-soft-gold-glow mb-6 md:mb-8 text-sm md:text-base">
              Please fill in your details to download
            </p>
            <form
              className="flex flex-col gap-6"
              onSubmit={handleModalSubmit}
              noValidate
            >
              <div className="w-full relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 ${
                    formErrors.name
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.name && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.name}
                  </span>
                )}
              </div>
              <div className="w-full relative">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 ${
                    formErrors.phone
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.phone && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.phone}
                  </span>
                )}
              </div>
              <div className="w-full relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 ${
                    formErrors.email
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.email && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.email}
                  </span>
                )}
              </div>
              <div className="w-full relative">
                <textarea
                  name="message"
                  placeholder="Your Message (Optional)"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-4 border-2 rounded-lg bg-cream text-royal-purple text-base font-body transition-all duration-300 min-h-[120px] leading-relaxed ${
                    formErrors.message
                      ? "border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                      : "border-gold focus:border-gold focus:shadow-[0_0_0_3px_rgba(212,175,55,0.2),0_0_20px_rgba(212,175,55,0.4)] focus:bg-white"
                  }`}
                />
                {formErrors.message && (
                  <span className="block text-red-300 text-sm mt-2 italic">
                    {formErrors.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                className="px-8 md:px-10 py-3 md:py-4 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-base md:text-lg cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Download"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/thanks" element={<ThanksPage />} />
      <Route path="/amenities" element={<Home />} />
      <Route path="/location" element={<Home />} />
      <Route path="/floorplans" element={<Home />} />
      <Route path="/contact" element={<Home />} />
    </Routes>
  );
}

export default App;
