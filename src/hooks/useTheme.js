import { useState, useEffect } from "react";

const KEY = "saailgo-theme";

function getInitial() {
  return document.documentElement.classList.contains("dark");
}

export default function useTheme() {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch (err) {
      console.error("Could not save theme", err);
    }
  };

  return [dark, toggle];
}