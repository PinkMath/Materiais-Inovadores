import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { tutorialsData, type Tutorial } from "@/mocks/tutorials";

const LAB_ROUTES: Record<number, string> = {
  1: "/labs/sql-injection",
  2: "/labs/network",
  3: "/labs/malware-scanner",
  6: "/labs/terminal",
};

interface TutorialCardProps {
  tutorial: Tutorial;
  expanded: boolean;
  onHover: () => void;
  labRoute: string;
  isDark: boolean;
}

function TutorialCard({ tutorial, expanded, onHover, labRoute, isDark }: TutorialCardProps) {
  const { t } = useTranslation();

  const difficultyConfig: Record<string, { label: string; color: string; colorLight: string }> = {
    beginner: {
      label: "tutorials.difficulty_beginner",
      color: "text-[#39FF14] border-[#39FF14]/40 bg-[#39FF14]/10",
      colorLight: "text-emerald-600 border-emerald-300/60 bg-emerald-50",
    },
    intermediate: {
      label: "tutorials.difficulty_intermediate",
      color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
      colorLight: "text-yellow-600 border-yellow-300/60 bg-yellow-50",
    },
    advanced: {
      label: "tutorials.difficulty_advanced",
      color: "text-red-400 border-red-400/40 bg-red-400/10",
      colorLight: "text-red-500 border-red-300/60 bg-red-50",
    },
  };

  const diff = difficultyConfig[tutorial.difficulty];
  const diffColor = isDark ? diff.color : diff.colorLight;

  return (
    <div
      onMouseEnter={onHover}
      onClick={onHover}
      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500
        /* mobile: full width stacked card with fixed height that expands */
        w-full
        /* desktop: flex-grow accordion */
        md:w-auto md:flex-shrink-0 ${expanded ? "md:flex-grow-[2]" : "md:flex-grow-[1]"}
        ${expanded ? "h-[340px] sm:h-[380px] md:h-auto" : "h-[120px] sm:h-[140px] md:h-auto"}
        md:h-auto
      `}
      style={{ minWidth: 0, minHeight: undefined }}
    >
      <div className="absolute inset-0" style={{ minHeight: expanded ? "340px" : "120px" }}>
        <img src={tutorial.image} alt={tutorial.title} className="w-full h-full object-cover object-top" />
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-[#0D0F14] via-[#0D0F14]/70 to-transparent" : "bg-gradient-to-t from-black/85 via-black/50 to-transparent"}`} />
      </div>

      <div className="relative h-full flex flex-col justify-end p-4 md:p-6" style={{ minHeight: expanded ? "340px" : "120px" }}>
        <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl border mb-3 md:mb-4 ${isDark ? "bg-[#00F5FF]/10 border-[#00F5FF]/20" : "bg-white/15 border-white/25"}`}>
          <i className={`${tutorial.icon} text-base md:text-lg ${isDark ? "text-[#00F5FF]" : "text-white"}`} />
        </div>

        <span className={`inline-block self-start text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full border mb-2 md:mb-3 ${diffColor}`}>
          {t(diff.label)}
        </span>

        <h3 className="text-white font-bold text-base md:text-lg leading-snug mb-2">{tutorial.title}</h3>

        <div className={`transition-all duration-500 overflow-hidden ${expanded ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-3 md:mb-4">{tutorial.description}</p>

          <div className="flex items-center gap-4 text-xs text-gray-400 mb-3 md:mb-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-time-line" /></span>
              {tutorial.duration}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-book-open-line" /></span>
              {tutorial.modules} {t("tutorials.modules_suffix")}
            </span>
          </div>

          {labRoute ? (
            <Link
              to={labRoute}
              className="flex items-center gap-2 bg-[#00F5FF] text-[#0D0F14] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#00F5FF]/90 transition-colors cursor-pointer whitespace-nowrap w-fit"
            >
              {t("tutorials.start_module")}
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-right-line" /></span>
            </Link>
          ) : (
            <button className="flex items-center gap-2 bg-[#00F5FF] text-[#0D0F14] text-xs font-bold px-5 py-2.5 rounded-full hover:bg-[#00F5FF]/90 transition-colors cursor-pointer whitespace-nowrap w-fit">
              {t("tutorials.start_module")}
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-right-line" /></span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TutorialsSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [expandedId, setExpandedId] = useState(tutorialsData[0].id);

  const accentColor = isDark ? "text-[#00F5FF]" : "text-[#00A8B0]";
  const tabActiveBg = isDark ? "bg-[#00F5FF] text-[#0D0F14]" : "bg-[#00A8B0] text-white";
  const tabContainerBg = isDark ? "bg-[#13161E] border-white/10" : "bg-white border-gray-200";

  return (
    <section id="tutorials" className={`py-16 md:py-24 px-4 md:px-6 ${isDark ? "bg-[#0D0F14]" : "bg-[#F0F4F8]"}`}>
      <div className="max-w-[1400px] mx-auto">
        <div data-reveal="" className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-4 md:gap-6">
          <div>
            <span className={`text-xs font-mono font-semibold tracking-widest mb-3 block ${accentColor}`}>
              [ {t("tutorials.section_label")} ]
            </span>
            <h2 className={`text-3xl md:text-5xl font-extrabold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("tutorials.section_title")}{" "}
              <span className={isDark ? "text-[#39FF14]" : "text-emerald-500"} style={isDark ? { textShadow: "0 0 20px rgba(57,255,20,0.4)" } : undefined}>⚡</span>
            </h2>
            <p className={`mt-3 max-w-xl text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("tutorials.section_subtitle")}</p>
          </div>

          <div className={`flex items-center border rounded-full px-1 py-1 gap-1 self-start md:self-auto ${tabContainerBg}`}>
            <span className={`flex items-center gap-2 text-xs font-semibold px-4 md:px-5 py-2 rounded-full whitespace-nowrap ${tabActiveBg}`}>
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-book-2-line" /></span>
              {t("tutorials.tab_modules")}
            </span>
            <Link
              to="/labs/terminal"
              className={`flex items-center gap-2 text-xs font-semibold px-4 md:px-5 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}
            >
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-terminal-box-line" /></span>
              {t("tutorials.tab_terminal")}
              <span className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-right-line text-[10px]" /></span>
            </Link>
          </div>
        </div>

        {/* Mobile: vertical stack, Desktop: horizontal accordion */}
        <div data-reveal="" className="flex flex-col gap-3 md:flex-row md:gap-3 md:overflow-hidden">
          {tutorialsData.map((tutorial) => (
            <TutorialCard
              key={tutorial.id}
              tutorial={tutorial}
              expanded={expandedId === tutorial.id}
              onHover={() => setExpandedId(tutorial.id)}
              labRoute={LAB_ROUTES[tutorial.id] ?? ""}
              isDark={isDark}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
