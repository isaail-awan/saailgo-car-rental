import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";

// Number 0 se (ya purani value se) nayi value tak ginti mein badhta hai
export default function CountUp({ value, duration = 1400, prefix = "", suffix = "", className = "" }) {
  const ref = useRef(null);
  const shown = useRef(0);
  const [reduced] = useState(prefersReducedMotion);
  const [display, setDisplay] = useState(0);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  // Pehli dafa tab shuru ho jab screen par nazar aaye
  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || reduced) return;

    const from = shown.current;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (value - from) * eased);
      shown.current = current;
      setDisplay(current);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, visible, reduced, duration]);

  const number = reduced ? value : display;

  return (
    <span ref={ref} className={className}>
      {prefix}{number.toLocaleString()}{suffix}
    </span>
  );
}