import { Link } from "react-router-dom";

// Login ke baghair kisi section ko lock karne wala card
export default function AuthGate({ title, text, state }) {
  return (
    <div className="rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl ring-1 ring-amber-200 dark:bg-amber-400/10 dark:ring-amber-400/30">🔒</div>
      <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-slate-600 dark:text-slate-400">{text}</p>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <Link to="/login" state={state} className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95">Log in</Link>
        <Link to="/signup" state={state} className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Create account</Link>
      </div>
    </div>
  );
}