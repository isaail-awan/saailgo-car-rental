import { useState } from "react";
import { Link } from "react-router-dom";
import { brand } from "../data/brand";
import ThemeToggle from "./ThemeToggle";

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
      {link.to === "/#history" && count > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">{count}</span>}
    </>
  );
}

export default function Navbar({ bookingCount = 0, dark, onToggleTheme }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur text-white shadow dark:border-b dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/#home" className="text-xl font-bold tracking-wide">{brand.first}<span className="text-amber-400">{brand.second}</span></Link>

        <div className="flex items-center gap-2">
          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-8 mr-4">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-amber-400 transition-colors"><NavLabel link={l} count={bookingCount} /></Link>
              </li>
            ))}
          </ul>

          <ThemeToggle dark={dark} onToggle={onToggleTheme} />

          {/* Mobile toggle */}
          <button
            className="md:hidden text-2xl w-9 h-9"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-slate-900 px-4 pb-4 space-y-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setOpen(false)} className="block py-1 hover:text-amber-400"><NavLabel link={l} count={bookingCount} /></Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}