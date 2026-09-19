import { useState, useEffect } from "react";
import { brand } from "../data/brand";

const css = `
  .sg-circle { stroke-dasharray: 145; stroke-dashoffset: 145; animation: sg-draw 0.6s ease forwards; }
  .sg-check { stroke-dasharray: 40; stroke-dashoffset: 40; animation: sg-draw 0.4s ease 0.5s forwards; }
  @keyframes sg-draw { to { stroke-dashoffset: 0; } }
  @keyframes sg-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
  .sg-rise { animation: sg-rise 0.5s ease both; }
  @media print {
    body * { visibility: hidden; }
    #ticket, #ticket * { visibility: visible; }
    #ticket { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none; }
    #ticket, #ticket * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 break-words font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default function BookingConfirmation({ booking, onReset }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { id, car, days, total, form } = booking;

  const submitted = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const dayLabel = days === 1 ? "day" : "days";

  useEffect(() => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(id).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <section id="booking" className="max-w-3xl mx-auto px-4 py-20 scroll-mt-20">
      <style>{css}</style>

      <div id="ticket" className="sg-rise overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200">
        {/* Header band */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-7 text-white md:px-10">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <svg viewBox="0 0 52 52" className="h-14 w-14 shrink-0" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <circle className="sg-circle" cx="26" cy="26" r="23" strokeWidth="3" />
                <path className="sg-check" d="M15 27l8 8 15-16" />
              </svg>
              <div>
                <p className="text-xl font-bold md:text-2xl">Booking request received</p>
                <p className="text-sm text-slate-400">{brand.first}{brand.second} car rental</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Booking ID</p>
              <button onClick={handleCopy} title="Copy booking ID" className="mt-1 inline-flex items-center gap-3 rounded-lg bg-white/10 px-3 py-1.5 font-mono text-lg font-semibold tracking-wider transition hover:bg-white/20">
                {id}
                <span className="font-sans text-xs font-medium text-amber-300">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Trip details */}
        <div className="px-6 py-8 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Pending confirmation
            </span>
            <span className="text-xs text-slate-400">Submitted on {submitted}</span>
          </div>

          <div className="mt-6 flex items-center gap-5">
            <div className="h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 md:w-40">
              {!imgError ? (
                <img src={car.image} alt={car.name} onError={() => setImgError(true)} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">🚗</div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">{car.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{car.category} · {car.fuel} · {car.seats} seats</p>
              <p className="mt-2 text-sm font-semibold text-slate-700">
                Rs. {car.pricePerDay.toLocaleString()} <span className="font-normal text-slate-400">/ day</span>
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-2xl bg-slate-50 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Pick-up</p>
              <p className="mt-1 font-bold text-slate-900">{formatDate(form.pickupDate)}</p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-amber-600">{days} {dayLabel}</span>
              <div className="mt-1 flex items-center">
                <span className="h-2 w-2 rounded-full bg-slate-900" />
                <span className="h-px w-8 bg-slate-300 md:w-20" />
                <span className="h-2 w-2 rounded-full border-2 border-slate-900 bg-white" />
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Return</p>
              <p className="mt-1 font-bold text-slate-900">{formatDate(form.returnDate)}</p>
            </div>
          </div>
        </div>

        {/* Tear line */}
        <div className="relative">
          <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50 ring-1 ring-slate-200" />
          <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50 ring-1 ring-slate-200" />
          <div className="mx-8 border-t-2 border-dashed border-slate-200" />
        </div>

        {/* Customer and price */}
        <div className="px-6 py-8 md:px-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <Detail label="Name" value={form.name.trim()} />
            <Detail label="Phone" value={form.phone} />
            <Detail label="Email" value={form.email.trim()} />
          </div>

          {form.notes.trim() && (
            <div className="mt-6">
              <Detail label="Special requests" value={form.notes.trim()} />
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-slate-200 p-5">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Rs. {car.pricePerDay.toLocaleString()} x {days} {dayLabel}</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-500">Estimated total</span>
              <span className="text-3xl font-extrabold text-slate-900">Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <p className="mt-5 text-sm text-slate-500">
            Our team will contact you on <span className="font-semibold text-slate-700">{form.phone}</span> to confirm your booking.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button onClick={() => window.print()} className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">Print receipt</button>
        <button onClick={onReset} className="rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300">Make another booking</button>
      </div>
    </section>
  );
}