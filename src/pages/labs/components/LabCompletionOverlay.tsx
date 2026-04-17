import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export interface LabCompletionConfig {
  /** e.g. "SQL INJECTION LAB" */
  badgeLabel: string;
  /** Main title e.g. "Lab Complete" */
  title: string;
  /** Supporting subtitle text */
  subtitle: string;
  /** Final score to display (number) */
  score: number;
  /** Score label override (optional) */
  scoreLabel?: string;
  /** Rank title e.g. "SQL Injection Specialist" */
  rankValue: string;
  /** Skill tags to show */
  skills: { label: string; icon: string; color: string }[];
  /** Route for the "next lab" button */
  nextLabRoute: string;
  /** Label for the next lab button */
  nextLabLabel: string;
  /** Accent color for this lab, e.g. "#39FF14" or "#00F5FF" */
  accentColor: string;
  /** Stats row: [label, value] tuples */
  stats: [string, string][];
  /** Certificate ID prefix e.g. "CERT-VTX-SQL" */
  certPrefix: string;
  /** count completed */
  completedCount: number;
  /** total */
  totalCount: number;
  /** unit label for progress e.g. "challenges solved" */
  unitLabel: string;
}

interface Props {
  config: LabCompletionConfig;
  onReplay: () => void;
}

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>, accentColor: string) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const palette = [accentColor, "#FFD700", "#FF6B6B", "#C084FC", "#FFFFFF", "#00F5FF"];

    type P = {
      x: number; y: number; vx: number; vy: number;
      color: string; size: number; rotation: number; rotSpeed: number; alpha: number;
    };

    const particles: P[] = Array.from({ length: 140 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 260,
      y: canvas.height * 0.27,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.82) * 14,
      color: palette[Math.floor(Math.random() * palette.length)],
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
  }, [canvasRef, accentColor]);
}

export default function LabCompletionOverlay({ config, onReplay }: Props) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const [completedAt] = useState(() => new Date());

  useConfetti(canvasRef, config.accentColor);

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

  const certId = `${config.certPrefix}-${completedAt.getFullYear()}${String(completedAt.getMonth() + 1).padStart(2, "0")}${String(completedAt.getDate()).padStart(2, "0")}`;

  const accent = config.accentColor;
  const isGreen = accent === "#39FF14";

  const cardBg = isDark ? "bg-[#13161E] border-white/8" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";

  const accentText = isDark ? `text-[${accent}]` : (isGreen ? "text-emerald-500" : "text-[#00A8B0]");
  const accentBorder = isDark ? `border-[${accent}]/20` : (isGreen ? "border-emerald-300" : "border-[#00A8B0]/30");
  const accentBg = isDark ? `bg-[${accent}]/8` : (isGreen ? "bg-emerald-50" : "bg-[#00A8B0]/8");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"} ${isDark ? "bg-[#0A0C10]/93 backdrop-blur-md" : "bg-[#F0F4F8]/93 backdrop-blur-md"}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div
        className={`relative w-full max-w-2xl border rounded-2xl overflow-hidden transition-all duration-500 ${cardBg} ${visible ? "translate-y-0 scale-100" : "translate-y-8 scale-95"}`}
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Accent top bar */}
        <div
          className="h-1 w-full"
          style={{ background: isDark ? `linear-gradient(90deg, ${accent}, #fff4, ${accent})` : `linear-gradient(90deg, ${accent}99, ${accent}, ${accent}99)` }}
        />

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center">
          <div className="relative inline-flex items-center justify-center mb-5">
            <div
              className="w-24 h-24 rounded-full border-4 flex items-center justify-center"
              style={{
                borderColor: isDark ? `${accent}44` : `${accent}88`,
                backgroundColor: isDark ? `${accent}10` : `${accent}15`,
                boxShadow: isDark ? `0 0 48px ${accent}AA, 0 0 90px ${accent}28` : `0 0 32px ${accent}50`,
              }}
            >
              <i className="ri-shield-check-fill text-4xl" style={{ color: accent }} />
            </div>
            <div
              className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: accent, color: isDark ? "#000" : "#fff" }}
            >
              <i className="ri-check-line" />
            </div>
          </div>

          <p
            className="text-[10px] font-mono tracking-widest mb-2"
            style={{ color: accent }}
          >
            {config.badgeLabel}
          </p>
          <h2 className={`text-3xl font-extrabold mb-2 ${textPrimary}`}>{config.title}</h2>
          <p className={`text-sm leading-relaxed max-w-md mx-auto ${textSecondary}`}>{config.subtitle}</p>
        </div>

        {/* Stats */}
        <div
          className={`mx-6 mb-5 grid divide-x rounded-xl border overflow-hidden ${isDark ? "border-white/8 divide-white/8 bg-[#0D0F14]" : "border-gray-200 divide-gray-200 bg-gray-50"}`}
          style={{ gridTemplateColumns: `repeat(${config.stats.length}, minmax(0, 1fr))` }}
        >
          {config.stats.map(([label, value], i) => (
            <div key={label} className="px-4 py-4 text-center">
              <p className={`text-[9px] font-mono tracking-wider mb-1 ${textMuted}`}>{label}</p>
              <p
                className="text-xl font-extrabold font-mono"
                style={i === 0 ? { color: accent, textShadow: isDark ? `0 0 18px ${accent}` : "none" } : undefined}
                {...(i !== 0 ? { className: `text-xl font-extrabold font-mono ${textPrimary}` } : {})}
              >
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Rank card */}
        <div
          className={`mx-6 mb-5 rounded-xl border px-5 py-4 flex items-center gap-4`}
          style={{
            borderColor: isDark ? `${accent}20` : `${accent}55`,
            background: isDark ? `linear-gradient(90deg, ${accent}08, ${accent}04)` : `linear-gradient(90deg, ${accent}10, ${accent}06)`,
          }}
        >
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ backgroundColor: isDark ? `${accent}15` : `${accent}20`, color: accent }}
          >
            <i className="ri-award-fill text-lg" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-mono tracking-wider ${textMuted}`}>{t("completion.rank_label")}</p>
            <p className={`text-base font-bold ${textPrimary}`}>{config.rankValue}</p>
          </div>
          <div
            className="text-[10px] font-mono px-3 py-1 rounded-full border whitespace-nowrap"
            style={{ borderColor: `${accent}30`, color: accent, backgroundColor: `${accent}08` }}
          >
            {config.completedCount}/{config.totalCount} {config.unitLabel}
          </div>
        </div>

        {/* Skills */}
        <div className="mx-6 mb-5">
          <p className={`text-[9px] font-mono tracking-wider mb-3 ${textMuted}`}>{t("completion.skills_label")}</p>
          <div className="flex flex-wrap gap-2">
            {config.skills.map((s) => (
              <span
                key={s.label}
                className={`flex items-center gap-1.5 text-[11px] font-mono border px-3 py-1.5 rounded-full ${isDark ? "border-white/10 bg-white/3 text-gray-300" : "border-gray-200 bg-white text-gray-600"}`}
              >
                <span className={`w-3 h-3 flex items-center justify-center ${s.color}`}>
                  <i className={s.icon} />
                </span>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Certificate ID */}
        <div className={`mx-6 mb-5 rounded-xl border px-5 py-3 flex items-center gap-3 ${isDark ? "bg-[#0D0F14] border-white/5" : "bg-gray-50 border-gray-200"}`}>
          <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${textMuted}`}>
            <i className="ri-file-text-line text-sm" />
          </span>
          <div className="flex-1 min-w-0">
            <p className={`text-[9px] font-mono tracking-wider ${textMuted}`}>{t("completion.certificate_label")}</p>
            <p className="text-xs font-mono" style={{ color: accent }}>{certId}</p>
          </div>
        </div>

        {/* Share */}
        <div className="mx-6 mb-6">
          <p className={`text-[9px] font-mono tracking-wider mb-2 ${textMuted}`}>{t("completion.share_label")}</p>
          <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${isDark ? "bg-[#0D0F14] border-white/5" : "bg-gray-50 border-gray-200"}`}>
            <p className={`flex-1 text-xs font-mono truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {t("completion.share_text")}
            </p>
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 text-[10px] font-mono border px-3 py-1.5 rounded-full cursor-pointer transition-all whitespace-nowrap ${
                copied
                  ? `${accentText} ${accentBorder} ${accentBg}`
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

        {/* Actions */}
        <div className="px-6 pb-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReplay}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-mono border py-3 rounded-xl cursor-pointer transition-colors whitespace-nowrap ${isDark ? "border-white/10 text-gray-400 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-400"}`}
          >
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-restart-line" /></span>
            {t("completion.replay_btn")}
          </button>
          <button
            onClick={() => navigate(config.nextLabRoute)}
            className="flex-1 flex items-center justify-center gap-2 text-sm font-mono py-3 rounded-xl cursor-pointer transition-colors whitespace-nowrap border"
            style={{
              borderColor: `${accent}30`,
              backgroundColor: isDark ? `${accent}10` : `${accent}15`,
              color: accent,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? `${accent}20` : `${accent}25`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = isDark ? `${accent}10` : `${accent}15`; }}
          >
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line" /></span>
            {config.nextLabLabel}
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
