import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-32 text-center">
      <p className="text-6xl">🛣️</p>
      <h1 className="mt-6 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">The page or car you are looking for does not exist.</p>
      <Link to="/#cars" className="mt-8 inline-block rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-300">Browse all cars</Link>
    </section>
  );
}