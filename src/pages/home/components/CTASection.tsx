import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function CTASection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scanRef = useRef<HTMLCanvasElement>(null);

  // Parallax scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      bgRef.current.style.transform = `translateY(${progress * 80}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scanline + glow canvas
  useEffect(() => {
    const canvas = scanRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let offset = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scanlines
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(0, y, canvas.width, 1.5);
      }

      // Animated horizontal sweep line
      const sweepY = (offset % canvas.height);
      const grad = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY + 60);
      grad.addColorStop(0, "rgba(0,245,255,0)");
      grad.addColorStop(0.5, "rgba(0,245,255,0.07)");
      grad.addColorStop(1, "rgba(0,245,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, sweepY - 60, canvas.width, 120);

      offset += 1.2;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="relative py-24 md:py-36 px-4 md:px-6 overflow-hidden bg-[#060810]"
    >
      {/* Background image with parallax */}
      <div className="absolute inset-0" style={{ overflow: "hidden" }}>
        <div
          ref={bgRef}
          className="absolute will-change-transform"
          style={{ top: "-15%", left: 0, right: 0, bottom: "-15%" }}
        >
          <img
            src="https://readdy.ai/api/search-image?query=dark%20abstract%20cyberpunk%20digital%20city%20with%20glowing%20data%20streams%20holographic%20interfaces%20and%20neon%20light%20trails%20on%20deep%20black%20background%2C%20highly%20detailed%20dark%20sci-fi%20tech%20concept%20art%2C%20cyan%20and%20green%20neon%20accents%2C%20cinematic%20wide%20angle&width=1920&height=900&seq=ctabg1&orientation=landscape"
            alt="CTA background"
            className="w-full h-full object-cover object-center"
            style={{ opacity: isDark ? 0.28 : 0.18 }}
          />
        </div>
        {/* Deep gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#060810]/70 via-[#060810]/40 to-[#060810]/80" />
        {/* Radial glow — center cyan */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,245,255,0.07) 0%, transparent 70%)",
          }}
        />
        {/* Radial glow — bottom green */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(57,255,20,0.06) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Scanline canvas */}
      <canvas ref={scanRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} />

      {/* HUD corner decorations */}
      <div className="absolute top-5 left-5 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="w-6 h-6 border-t-2 border-l-2 border-[#00F5FF]/30 rounded-tl" />
      </div>
      <div className="absolute top-5 right-5 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="w-6 h-6 border-t-2 border-r-2 border-[#00F5FF]/30 rounded-tr" />
      </div>
      <div className="absolute bottom-5 left-5 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="w-6 h-6 border-b-2 border-l-2 border-[#39FF14]/25 rounded-bl" />
      </div>
      <div className="absolute bottom-5 right-5 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="w-6 h-6 border-b-2 border-r-2 border-[#39FF14]/25 rounded-br" />
      </div>

      {/* Horizontal top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          zIndex: 2,
          background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.4), rgba(57,255,20,0.4), transparent)",
        }}
      />
      {/* Horizontal bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          zIndex: 2,
          background: "linear-gradient(90deg, transparent, rgba(57,255,20,0.3), rgba(0,245,255,0.3), transparent)",
        }}
      />

      {/* Content */}
      <div data-reveal="" className="relative max-w-3xl mx-auto text-center" style={{ zIndex: 3 }}>

        {/* Terminal status lines */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" style={{ boxShadow: "0 0 8px #39FF14" }} />
            <span className="text-[10px] font-mono tracking-widest text-[#39FF14]">SYSTEM ONLINE</span>
          </div>
          <div className="flex items-center gap-6 text-[9px] font-mono text-gray-500 tracking-widest">
            <span><span className="text-[#00F5FF]/60">[ </span>PLATFORM SECURE<span className="text-[#00F5FF]/60"> ]</span></span>
            <span><span className="text-[#00F5FF]/60">[ </span>LABS ACTIVE<span className="text-[#00F5FF]/60"> ]</span></span>
            <span><span className="text-[#00F5FF]/60">[ </span>THREAT FEED LIVE<span className="text-[#00F5FF]/60"> ]</span></span>
          </div>
        </div>

        {/* Shield icon with glow ring */}
        <div className="relative inline-flex items-center justify-center mb-7">
          <div
            className="w-20 h-20 rounded-full border-2 border-[#00F5FF]/25 flex items-center justify-center"
            style={{ background: "radial-gradient(circle, rgba(0,245,255,0.12) 0%, rgba(0,245,255,0.03) 70%)", boxShadow: "0 0 40px rgba(0,245,255,0.15), 0 0 80px rgba(0,245,255,0.06)" }}
          >
            <i className="ri-shield-flash-line text-3xl text-[#00F5FF]" style={{ textShadow: "0 0 20px rgba(0,245,255,0.8)" }} />
          </div>
          {/* Orbit ring */}
          <div
            className="absolute w-28 h-28 rounded-full border border-[#00F5FF]/10"
            style={{ animation: "spin 12s linear infinite" }}
          />
          <div
            className="absolute w-36 h-36 rounded-full border border-[#39FF14]/6"
            style={{ animation: "spin 20s linear infinite reverse" }}
          />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight mb-5 tracking-tight text-white" style={{ textShadow: "0 0 60px rgba(0,245,255,0.12)" }}>
          {t("cta.title")}
        </h2>
        <p className="text-sm md:text-lg leading-relaxed mb-10 max-w-xl mx-auto text-white/70">
          {t("cta.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <a
            href="#tutorials"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#00F5FF] text-[#060810] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#00F5FF]/90 transition-all duration-200 cursor-pointer whitespace-nowrap"
            style={{ boxShadow: "0 0 24px rgba(0,245,255,0.35)" }}
          >
            <span className="w-5 h-5 flex items-center justify-center"><i className="ri-play-circle-line" /></span>
            {t("cta.button")}
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line" /></span>
          </a>
          <a
            href="#tools"
            className="w-full sm:w-auto flex items-center justify-center gap-3 border border-[#39FF14]/50 text-[#39FF14] font-bold text-sm px-8 py-3.5 rounded-full hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all duration-200 cursor-pointer whitespace-nowrap"
            style={{ boxShadow: "0 0 20px rgba(57,255,20,0.12)" }}
          >
            <span className="w-5 h-5 flex items-center justify-center"><i className="ri-terminal-box-line" /></span>
            {t("cta.button_tools")}
          </a>
        </div>

        {/* Bottom mono line */}
        <p className="mt-10 text-[9px] font-mono text-gray-600 tracking-widest">
          VANTIX SECURITY PLATFORM — FREE &amp; OPEN SOURCE — v2.0
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
