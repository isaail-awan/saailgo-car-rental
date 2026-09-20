import { useState } from "react";
import { Link } from "react-router-dom";
import { brand } from "../data/brand";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";
import useAuth from "../hooks/useAuth";

const links = [
  { label: "Home", to: "/#home" },
  { label: "Cars", to: "/#cars" },
  { label: "Book Now", to: "/#booking" },
  { label: "My Bookings", to: "/#history" },
  { label: "Contact", to: "/#contact" },
];

function NavLabel({ link, count }) {
  return (
    <>
      {link.label}
      {link.to === "/#history" && count > 0 && <span key={count} className="anim-badge ml-2 inline-block rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">{count}</span>}
    </>
  );
}

const desktopLinkClass = "relative transition-colors hover:text-amber-400 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-amber-400 after:content-[''] after:transition-transform after:duration-300 hover:after:scale-x-100";

export default function Navbar({ bookingCount = 0, dark, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur text-white shadow dark:border-b dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/#home" className="text-xl font-bold tracking-wide">{brand.first}<span className="text-amber-400">{brand.second}</span></Link>

        <div className="flex items-center gap-2">
          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-8 mr-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={desktopLinkClass}><NavLabel link={l} count={bookingCount} /></Link>
              </li>
            ))}
          </ul>

          <ThemeToggle dark={dark} onToggle={onToggleTheme} />

          {user ? (
            <UserMenu />
          ) : (
            <div className="hidden lg:flex items-center gap-2 ml-1">
              <Link to="/login" className="rounded-lg px-3 py-1.5 text-sm font-medium transition hover:text-amber-400">Log in</Link>
              <Link to="/signup" className="rounded-lg bg-amber-400 px-4 py-1.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 active:scale-95">Sign up</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-2xl w-9 h-9"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="anim-slide-down lg:hidden bg-slate-900 px-4 pb-4 space-y-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setOpen(false)} className="block py-1 hover:text-amber-400"><NavLabel link={l} count={bookingCount} /></Link>
            </li>
          ))}

          {!user && (
            <li className="flex gap-3 border-t border-slate-700 pt-4">
              <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-slate-600 py-2 text-center font-medium transition hover:border-amber-400 hover:text-amber-400">Log in</Link>
              <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 rounded-lg bg-amber-400 py-2 text-center font-semibold text-slate-900 transition hover:bg-amber-300">Sign up</Link>
            </li>
          )}
        </ul>
      )}
    </nav>
  );
}