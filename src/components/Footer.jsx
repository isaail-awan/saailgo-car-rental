import { brand } from "../data/brand";

export default function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-white text-xl font-bold mb-2">
            {brand.first}<span className="text-amber-400">{brand.second}</span>
          </h3>
          <p className="text-sm">Affordable and reliable car rental service. Book online in minutes.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#home" className="hover:text-amber-400">Home</a></li>
            <li><a href="#cars" className="hover:text-amber-400">Cars</a></li>
            <li><a href="#booking" className="hover:text-amber-400">Book Now</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Contact</h4>
          <ul className="space-y-1 text-sm">
            <li>Email: {brand.email}</li>
            <li>Phone: {brand.phone}</li>
            <li className="flex gap-4 pt-2">
              <a href="#" className="hover:text-amber-400">Facebook</a>
              <a href="#" className="hover:text-amber-400">Instagram</a>
              <a href="#" className="hover:text-amber-400">LinkedIn</a>
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