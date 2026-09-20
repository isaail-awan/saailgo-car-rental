import { useId } from "react";
import { brand } from "../data/brand";

const ROAD = "M34 14 C26 8, 13 11, 15 19 C17 27, 33 22, 33 30 C33 38, 20 40, 13 34";

export function LogoMark({ className = "h-9 w-9" }) {
  const gradientId = "sg-grad-" + useId().replace(/[^a-zA-Z0-9_-]/g, "");

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill={"url(#" + gradientId + ")"} />
      <path d={ROAD} fill="none" stroke="#0f172a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <path d={ROAD} pathLength="100" fill="none" stroke="#fbbf24" strokeWidth="1.6" strokeDasharray="4 6" strokeDashoffset="-3" />
    </svg>
  );
}

// Dark background (navbar, footer) ke liye: safed naam, amber "Go"
export default function Logo({ className = "", textClass = "text-xl", markClass = "h-9 w-9" }) {
  return (
    <span className={"group inline-flex items-center gap-2.5 " + className}>
      <LogoMark className={markClass + " shrink-0 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"} />
      <span className={"font-bold tracking-tight text-white " + textClass} style={{ fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif" }}>
        {brand.first}<span className="text-amber-400">{brand.second}</span>
      </span>
    </span>
  );
}