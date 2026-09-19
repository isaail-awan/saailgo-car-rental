import { useState } from "react";
import { Link } from "react-router-dom";
import { shortDate } from "../utils/bookings";

export default function CarCard({ car, onBook, bookings = [] }) {
  const [imgError, setImgError] = useState(false);

  const hasBookings = car.available && bookings.length > 0;
  const statusLabel = !car.available ? "Booked" : hasBookings ? "Partly booked" : "Available";
  const statusClass = !car.available ? "bg-red-500 text-white" : hasBookings ? "bg-amber-500 text-white" : "bg-green-500 text-white";
  const detailsPath = "/cars/" + car.id;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900 dark:ring-slate-800">
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
        <Link to={detailsPath} aria-label={"View details of " + car.name} className="block h-full w-full">
          {!imgError ? (
            <img src={car.image} alt={car.name} onError={() => setImgError(true)} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">🚗</div>
          )}
        </Link>

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-medium text-white">{car.category}</span>

        <span className={"pointer-events-none absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold " + statusClass}>{statusLabel}</span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          <Link to={detailsPath} className="transition hover:text-amber-500">{car.name}</Link>
        </h3>

        <div className="mt-3 flex gap-4 text-sm text-slate-600 dark:text-slate-400">
          <span>⛽ {car.fuel}</span>
          <span>👥 {car.seats} Seats</span>
        </div>

        {hasBookings && (
          <div className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30">
            <p className="font-semibold">Already booked:</p>
            {bookings.slice(0, 2).map((b) => (
              <p key={b.id}>{shortDate(b.pickupDate)} to {shortDate(b.returnDate)}</p>
            ))}
            {bookings.length > 2 && <p>+{bookings.length - 2} more</p>}
          </div>
        )}

        <Link to={detailsPath} className="mt-4 inline-block text-sm font-semibold text-amber-600 transition hover:text-amber-500 dark:text-amber-400">View details →</Link>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">
            Rs. {car.pricePerDay.toLocaleString()}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400"> / day</span>
          </p>

          {car.available ? (
            <button onClick={() => onBook(car.id)} className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300">Book Now</button>
          ) : (
            <span className="cursor-not-allowed rounded-lg bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500 dark:bg-slate-800">Unavailable</span>
          )}
        </div>
      </div>
    </div>
  );
}