import { useState } from "react";
import cars from "../data/cars";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { getToday } from "../utils/bookings";

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

function daysBetween(a, b) {
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
}

function getStatus(booking, today) {
  if (booking.status === "cancelled") return "cancelled";
  if (booking.returnDate < today) return "completed";
  if (booking.pickupDate <= today) return "ongoing";
  return "upcoming";
}

const statusStyles = {
  upcoming: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  ongoing: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/30",
  completed: "bg-green-50 text-green-700 ring-green-200 dark:bg-green-400/10 dark:text-green-300 dark:ring-green-400/30",
  cancelled: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
};

const statusLabels = {
  upcoming: "Upcoming",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

function BookingItem({ row, onCancel }) {
  const [imgError, setImgError] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { car, status } = row;
  const isCancelled = status === "cancelled";

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 transition duration-300 hover:shadow-lg sm:flex-row sm:items-center dark:bg-slate-900 dark:ring-slate-800">
      <div className={"h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 transition duration-500 sm:w-40 dark:from-slate-700 dark:to-slate-800 " + (isCancelled ? "opacity-50 grayscale" : "")}>
        {car && !imgError ? (
          <img src={car.image} alt={car.name} onError={() => setImgError(true)} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">🚗</div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className={"text-lg font-bold " + (isCancelled ? "text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-white")}>{car ? car.name : "Car"}</h3>
          <span className={"rounded-full px-3 py-0.5 text-xs font-semibold ring-1 " + statusStyles[status]}>{statusLabels[status]}</span>
        </div>
        <p className="mt-1 font-mono text-xs text-slate-400 dark:text-slate-500">{row.id}</p>
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {formatDate(row.pickupDate)} <span className="text-slate-400">to</span> {formatDate(row.returnDate)}
          <span className="ml-2 text-slate-400">({row.days} {row.days === 1 ? "day" : "days"})</span>
        </p>
        {row.name && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Booked by {row.name}</p>}
        {isCancelled && row.cancelledAt && <p className="anim-fade-in mt-2 text-sm font-medium text-red-600 dark:text-red-400">Cancelled on {formatDateTime(row.cancelledAt)}</p>}
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:flex-col sm:items-end">
        <p className={"text-xl font-extrabold " + (isCancelled ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-900 dark:text-white")}>Rs. {row.total.toLocaleString()}</p>

        {status === "upcoming" && (confirming ? (
          <div className="anim-fade-in flex gap-2">
            <button onClick={() => onCancel(row.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95">Yes, cancel</button>
            <button onClick={() => setConfirming(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Keep</button>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-95 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10">Cancel booking</button>
        ))}
      </div>
    </div>
  );
}

export default function BookingHistory({ bookings = [], onCancel, onClear }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const today = getToday();

  const rows = [...bookings].reverse().map((b) => {
    const car = cars.find((c) => c.id === b.carId);
    const days = daysBetween(b.pickupDate, b.returnDate);
    const total = b.total ?? (car ? days * car.pricePerDay : 0);
    return { ...b, car, days, total, status: getStatus(b, today) };
  });

  const activeCount = rows.filter((r) => r.status === "upcoming" || r.status === "ongoing").length;
  const cancelledCount = rows.filter((r) => r.status === "cancelled").length;
  const totalValue = rows.filter((r) => r.status !== "cancelled").reduce((sum, r) => sum + r.total, 0);

  const stats = [
    { label: "Total bookings", value: rows.length, valueClass: "text-2xl md:text-3xl text-slate-900 dark:text-white" },
    { label: "Active", value: activeCount, valueClass: "text-2xl md:text-3xl text-slate-900 dark:text-white" },
    { label: "Cancelled", value: cancelledCount, valueClass: "text-2xl md:text-3xl text-red-500" },
    { label: "Total value", value: totalValue, prefix: "Rs. ", valueClass: "text-lg md:text-3xl text-slate-900 dark:text-white" },
  ];

  const handleClear = () => {
    onClear();
    setConfirmClear(false);
  };

  return (
    <section id="history" className="max-w-6xl mx-auto px-4 pb-20 scroll-mt-20">
      <Reveal>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">Your activity</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">My bookings</h2>
          </div>

          {rows.length > 0 && (confirmClear ? (
            <div className="anim-fade-in flex items-center gap-2 text-sm">
              <span className="text-slate-600 dark:text-slate-400">Delete all bookings?</span>
              <button onClick={handleClear} className="rounded-lg bg-red-500 px-3 py-1.5 font-semibold text-white transition hover:bg-red-600 active:scale-95">Yes, clear</button>
              <button onClick={() => setConfirmClear(false)} className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmClear(true)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Clear history</button>
          ))}
        </div>
      </Reveal>

      {rows.length === 0 ? (
        <Reveal animation="zoom">
          <div className="rounded-2xl bg-white py-14 text-center shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <p className="anim-float text-5xl">🗂️</p>
            <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">No bookings yet</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Your bookings will appear here once you reserve a car.</p>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} animation="zoom" delay={i * 100} className="h-full">
                <div className="h-full rounded-2xl bg-white p-4 text-center shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
                  <p className={"font-extrabold " + s.valueClass}><CountUp value={s.value} prefix={s.prefix || ""} /></p>
                  <p className="mt-1 text-xs text-slate-500 md:text-sm dark:text-slate-400">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="space-y-5">
            {rows.map((row, i) => (
              <Reveal key={row.id} delay={Math.min(i, 4) * 70}>
                <BookingItem row={row} onCancel={onCancel} />
              </Reveal>
            ))}
          </div>
        </>
      )}
    </section>
  );
}