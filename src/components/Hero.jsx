import { brand } from "../data/brand";

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block mb-5 rounded-full bg-amber-400/15 px-4 py-1 text-sm font-medium text-amber-300 ring-1 ring-amber-400/30">
            {brand.first}{brand.second}, your ride, your way
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Rent the perfect car for <span className="text-amber-400">every journey</span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 max-w-lg">
            From city commutes to family trips, choose from our well-maintained fleet and book online in just a few minutes. Simple pricing, no hidden charges.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#cars" className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300">Browse Cars</a>
            <a href="#booking" className="rounded-lg border border-slate-500 px-6 py-3 font-semibold text-white transition hover:border-amber-400 hover:text-amber-400">Book Now</a>
          </div>

          <div className="mt-12 flex gap-10">
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-slate-400">Cars available</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2K+</p>
              <p className="text-sm text-slate-400">Happy customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-sm text-slate-400">Support</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-sm uppercase tracking-widest text-amber-300">Starting from</p>
            <p className="mt-2 text-5xl font-extrabold">
              Rs. 4,000<span className="text-lg font-medium text-slate-400"> / day</span>
            </p>
            <ul className="mt-6 space-y-3 text-slate-300">
              <li>✔ Free cancellation up to 24 hours</li>
              <li>✔ Clean and sanitized vehicles</li>
              <li>✔ Flexible pickup and drop-off</li>
              <li>✔ Petrol, diesel and family options</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}