import { Link } from "react-router-dom";
import { brand } from "../data/brand";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <Link to="/#home" aria-label="Go to home page" className="mb-3 inline-block"><Logo /></Link>
          <p className="text-sm">Affordable and reliable car rental service. Book online in minutes.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/#home" className="hover:text-amber-400">Home</Link></li>
            <li><Link to="/#cars" className="hover:text-amber-400">Cars</Link></li>
            <li><Link to="/#booking" className="hover:text-amber-400">Book Now</Link></li>
            <li><Link to="/#history" className="hover:text-amber-400">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: {brand.email}</li>
            <li>Phone: {brand.phone}</li>
            <li className="flex gap-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-amber-400">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-amber-400">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-amber-400">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center text-xs py-4">
        © {new Date().getFullYear()} {brand.first}{brand.second}. All rights reserved.
      </div>
    </footer>
  );
}