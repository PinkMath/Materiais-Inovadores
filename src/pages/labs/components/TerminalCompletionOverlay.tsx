import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  completedCount: number;
  totalObjectives: number;
  onReplay: () => void;
}

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ["#39FF14", "#00F5FF", "#FFD700", "#FF6B6B", "#C084FC", "#FFFFFF"];

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; rotation: number; rotSpeed: number; alpha: number;
    };

    const particles: Particle[] = Array.from({ length: 130 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 240,
      y: canvas.height * 0.28,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 13,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 7,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 9,
      alpha: 1,
    }));

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach((p) => {
        p.vy += 0.38;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.alpha -= 0.007;
        if (p.alpha <= 0) return;
        alive = true;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        ctx.restore();
      });
      if (alive) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [canvasRef]);
}

export default function TerminalCompletionOverlay({ completedCount, totalObjectives, onReplay }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [completedAt] = useState(() => new Date());

  useConfetti(canvasRef);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(t("completion.share_text")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const timeStr = completedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const certId = `${t("completion.certificate_id")}-${completedAt.getFullYear()}${String(completedAt.getMonth() + 1).padStart(2, "0")}${String(completedAt.getDate()).padStart(2, "0")}`;

  const skills = [
    { key: "skill_fs", icon: "ri-folder-open-line", color: "text-amber-400" },
    { key: "skill_creds", icon: "ri-lock-unlock-line", color: "text-rose-400" },
    { key: "skill_hash", icon: "ri-key-line", color: isDark ? "text-[#39FF14]" : "text-emerald-500" },
    { key: "skill_network", icon: "ri-radar-line", color: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]" },
    { key: "skill_web", icon: "ri-bug-line", color: "text-purple-400" },
  ] as const;

  const cardBg = isDark ? "bg-[#13161E] border-white/8" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"} ${isDark ? "bg-[#0A0C10]/92 backdrop-blur-md" : "bg-[#F0F4F8]/92 backdrop-blur-md"}`}
    >
      {/* Confetti canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div
        className={`relative w-full max-w-2xl border rounded-2xl overflow-hidden transition-all duration-500 ${cardBg} ${visible ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Top accent gradient bar */}
        <div
          className="h-1 w-full"
          style={{ background: isDark ? "linear-gradient(90deg, #39FF14, #00F5FF, #39FF14)" : "linear-gradient(90deg, #34d399, #22d3ee, #34d399)" }}
        />

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center">
          {/* Badge */}
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${isDark ? "border-[#39FF14]/30 bg-[#39FF14]/5" : "border-emerald-300 bg-emerald-50"}`}
              style={{ boxShadow: isDark ? "0 0 48px #39FF14AA, 0 0 90px #39FF1428" : "0 0 32px rgba(52,211,153,0.35)" }}
            >
              <i className={`ri-shield-check-fill text-4xl ${isDark ? "text-[#39FF14]" : "text-emerald-500"}`} />
            </div>
            <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-[#39FF14] text-black" : "bg-emerald-500 text-white"}`}>
              <i className="ri-check-line" />
            </div>
          </div>

          <p className={`text-[10px] font-mono tracking-widest mb-2 ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>
            {t("completion.badge_label")}
          </p>
          <h2 className={`text-3xl font-extrabold mb-2 ${textPrimary}`}>{t("completion.title")}</h2>
          <p className={`text-sm leading-relaxed max-w-md mx-auto ${textSecondary}`}>
            {t("completion.subtitle")}
          </p>
        </div>

        {/* Stats */}
        <div
          className={`mx-6 mb-5 grid grid-cols-3 divide-x rounded-xl border overflow-hidden ${isDark ? "border-white/8 divide-white/8 bg-[#0D0F14]" : "border-gray-200 divide-gray-200 bg-gray-50"}`}
        >
          {[
            { label: t("completion.score_label"), value: "1000", accent: true },
            { label: t("completion.flags_label"), value: t("completion.flags_value"), accent: false },
            { label: t("completion.time_label"), value: timeStr, accent: false },
          ].map((stat) => (
            <div key={stat.label} className="px-4 py-4 text-center">
              <p className={`text-[9px] font-mono tracking-wider mb-1 ${textMuted}`}>{stat.label}</p>
              <p
                className={`text-xl font-extrabold font-mono ${stat.accent ? (isDark ? "text-[#39FF14]" : "text-emerald-500") : textPrimary}`}
                style={stat.accent && isDark ? { textShadow: "0 0 18px #39FF14" } : {}}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Rank */}
        <div
          className={`mx-6 mb-5 rounded-xl border px-5 py-4 flex items-center gap-4 ${isDark ? "bg-gradient-to-r from-[#39FF14]/5 to-[#00F5FF]/5 border-[#39FF14]/12" : "bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200"}`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0 ${isDark ? "bg-[#39FF14]/10 text-[#39FF14]" : "bg-emerald-100 text-emerald-600"}`}>
            <i className="ri-award-fill text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-mono tracking-wider ${textMuted}`}>{t("completion.rank_label")}</p>
            <p className={`text-base font-bold ${textPrimary}`}>{t("completion.rank_value")}</p>
          </div>
          <div className={`text-[10px] font-mono px-3 py-1 rounded-full border whitespace-nowrap ${isDark ? "border-[#39FF14]/20 text-[#39FF14] bg-[#39FF14]/5" : "border-emerald-300 text-emerald-700 bg-emerald-50"}`}>
            {completedCount}/{totalObjectives} {t("labs.objectives")}
          </div>
        </div>

        {/* Skills */}
        <div className="mx-6 mb-5">
          <p className={`text-[9px] font-mono tracking-wider mb-3 ${textMuted}`}>{t("completion.skills_label")}</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s.key}
                className={`flex items-center gap-1.5 text-[11px] font-mono border px-3 py-1.5 rounded-full ${isDark ? "border-white/10 bg-white/3 text-gray-300" : "border-gray-200 bg-white text-gray-600"}`}
              >
                <span className={`w-3 h-3 flex items-center justify-center ${s.color}`}>
                  <i className={s.icon} />
                </span>
                {t(`completion.${s.key}`)}
              </span>
            ))}
          </div>
        </div>

        {/* Certificate ID */}
        <div
          className={`mx-6 mb-5 rounded-xl border px-5 py-3 flex items-center gap-3 ${isDark ? "bg-[#0D0F14] border-white/5" : "bg-gray-50 border-gray-200"}`}
        >
          <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${textMuted}`}>
            <i className="ri-file-text-line text-sm" />
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-mono tracking-wider ${textMuted}`}>{t("completion.certificate_label")}</p>
            <p className={`text-xs font-mono ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{certId}</p>
          </div>
        </div>

        {/* Share */}
        <div className="mx-6 mb-6">
          <p className={`text-[9px] font-mono tracking-wider mb-2 ${textMuted}`}>{t("completion.share_label")}</p>
          <div
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${isDark ? "bg-[#0D0F14] border-white/5" : "bg-gray-50 border-gray-200"}`}
          >
            <p className={`flex-1 text-xs font-mono truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {t("completion.share_text")}
            </p>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono border px-3 py-1.5 rounded-full cursor-pointer transition-all whitespace-nowrap ${
                copied
                  ? isDark ? "border-[#39FF14]/30 text-[#39FF14] bg-[#39FF14]/5" : "border-emerald-300 text-emerald-600 bg-emerald-50"
                  : isDark ? "border-white/10 text-gray-400 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400"
              }`}
            >
              <span className="w-3 h-3 flex items-center justify-center">
                <i className={copied ? "ri-check-line" : "ri-clipboard-line"} />
              </span>
              {copied ? t("completion.copied_btn") : t("completion.copy_btn")}
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-6 pb-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReplay}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-mono border py-3 rounded-xl cursor-pointer transition-colors whitespace-nowrap ${isDark ? "border-white/10 text-gray-400 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400"}`}
          >
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-restart-line" /></span>
            {t("completion.replay_btn")}
          </button>
          <button
            onClick={() => navigate("/labs/sql-injection")}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-mono py-3 rounded-xl cursor-pointer transition-colors whitespace-nowrap border ${isDark ? "border-[#39FF14]/20 bg-[#39FF14]/8 text-[#39FF14] hover:bg-[#39FF14]/15" : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
          >
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line" /></span>
            {t("completion.next_lab_btn")}
          </button>
          <button
            onClick={() => navigate("/")}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-mono py-3 rounded-xl cursor-pointer transition-colors whitespace-nowrap ${isDark ? "bg-white text-black hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-gray-800"}`}
          >
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-home-line" /></span>
            {t("completion.home_btn")}
          </button>
        </div>
      </div>
    </div>
  );
}
