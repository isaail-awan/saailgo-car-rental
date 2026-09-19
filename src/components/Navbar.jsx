import { useState } from "react";
import { brand } from "../data/brand";

const links = [
  { label: "Home", href: "#home" },
  { label: "Cars", href: "#cars" },
  { label: "Book Now", href: "#booking" },
  { label: "My Bookings", href: "#history" },
  { label: "Contact", href: "#contact" },
];

function NavLabel({ link, count }) {
  return (
    <>
      {link.label}
      {link.href === "#history" && count > 0 && <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">{count}</span>}
    </>
  );
}

export default function Navbar({ bookingCount = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-slate-900/95 backdrop-blur text-white shadow">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#home" className="text-xl font-bold tracking-wide">
          {brand.first}<span className="text-amber-400">{brand.second}</span>
        </a>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hover:text-amber-400 transition-colors"><NavLabel link={l} count={bookingCount} /></a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden bg-slate-900 px-4 pb-4 space-y-3">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block py-1 hover:text-amber-400"><NavLabel link={l} count={bookingCount} /></a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}