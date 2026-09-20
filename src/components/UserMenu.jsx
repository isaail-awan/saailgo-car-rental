import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function UserMenu() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!user) return null;

  const initial = user.name.trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Account menu" aria-expanded={open} className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-900 transition hover:bg-amber-300 active:scale-90">{initial}</button>

      {open && (
        <div className="anim-slide-down absolute right-0 top-12 w-64 overflow-hidden rounded-xl bg-white text-slate-800 shadow-xl ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700">
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold text-slate-900 dark:text-white">{user.name}</p>
              {isAdmin && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">ADMIN</span>}
            </div>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-semibold text-amber-600 transition hover:bg-slate-50 dark:text-amber-400 dark:hover:bg-slate-700">Admin dashboard</Link>}
          <Link to="/#history" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-700">My bookings</Link>
          <button onClick={() => { setOpen(false); logout(); }} className="block w-full px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10">Log out</button>
        </div>
      )}
    </div>
  );
}