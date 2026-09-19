import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../utils/motion";

const variants = {
  up: "reveal-up",
  left: "reveal-left",
  right: "reveal-right",
  zoom: "reveal-zoom",
};

// Jab element screen par aata hai to animate hokar dikhta hai
export default function Reveal({ children, animation = "up", delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined" || prefersReducedMotion());

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
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  const classes = "reveal " + variants[animation] + (visible ? " is-visible" : "") + (className ? " " + className : "");

  return (
    <div ref={ref} className={classes} style={delay ? { transitionDelay: delay + "ms" } : undefined}>
      {children}
    </div>
  );
}