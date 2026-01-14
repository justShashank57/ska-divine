import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export default function ThanksPage() {
  const navigate = useNavigate();

  const handleReturnHome = useCallback(() => {
    navigate("/");
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0f2e] via-royal-purple to-deep-purple text-white text-center p-8 overflow-hidden">
        {/* Gold particles effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(244,223,165,0.08)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.05)_0%,transparent_50%)] pointer-events-none z-[1]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-royal-purple/25 via-deep-purple/20 to-[#1a0f2e]/25 z-[2]"></div>
        <div className="relative z-[3] max-w-3xl animate-[fadeInUp_0.8s_ease-out]">
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 tracking-wider text-gold text-shadow-gold">
            Thank You!
          </h1>
          <p className="font-body text-lg md:text-2xl mb-4 opacity-95 italic text-soft-gold-glow">
            Your request has been received
          </p>
          <p className="font-body text-base md:text-xl mb-12 opacity-90 text-soft-gold-glow max-w-2xl mx-auto leading-relaxed">
            We appreciate your interest in SKA DIVINE. Our team will contact you shortly with more information about our luxury residential project.
          </p>
          <div className="bg-royal-purple/75 backdrop-blur-[20px] rounded-2xl border-2 border-gold/50 shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.4)] p-8 md:p-10 mb-12 max-w-xl mx-auto">
            <h3 className="font-heading text-xl text-gold mb-4 tracking-wide">What's Next?</h3>
            <ul className="text-soft-gold-glow text-left space-y-3 font-body text-base md:text-lg">
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold mt-0.5">•</span>
                <span>Our team will reach out to you within 24 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold mt-0.5">•</span>
                <span>We'll answer all your questions about the project</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold mt-0.5">•</span>
                <span>Schedule a convenient site visit at your preferred time</span>
              </li>
            </ul>
          </div>
          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={handleReturnHome}
              className="px-8 md:px-10 py-2.5 md:py-3.5 bg-gold text-royal-purple border-2 border-gold rounded-lg font-heading font-semibold text-sm md:text-base cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 tracking-wide relative overflow-hidden hover:bg-deep-purple hover:text-gold hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(212,175,55,0.6),0_4px_15px_rgba(0,0,0,0.3)]"
            >
              Return to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
