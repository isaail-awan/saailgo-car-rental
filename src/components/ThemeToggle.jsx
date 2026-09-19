export default function ThemeToggle({ dark, onToggle }) {
  const label = dark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button onClick={onToggle} aria-label={label} title={label} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-amber-400 active:scale-90">
      {dark ? (
        <svg key="sun" viewBox="0 0 24 24" className="anim-pop h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      ) : (
        <svg key="moon" viewBox="0 0 24 24" className="anim-pop h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}