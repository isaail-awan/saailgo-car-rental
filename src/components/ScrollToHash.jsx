import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Page badalne par top par jaye, aur /#cars jaisay links par us section tak scroll kare
export default function ScrollToHash() {
  const { pathname, hash, key } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const pageChanged = previousPath.current !== pathname;
    previousPath.current = pathname;
    const behavior = pageChanged ? "instant" : "smooth";

    if (!hash || hash === "#home") {
      window.scrollTo({ top: 0, left: 0, behavior });
      return;
    }

    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior, block: "start" });
  }, [pathname, hash, key]);

  return null;
}