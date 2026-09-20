import { useState } from "react";
import cars from "../../data/cars";
import { formatDate, statusStyles } from "../../utils/status";
import { getToday } from "../../utils/bookings";

function CarThumb({ car }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800">
      {!imgError ? (
        <img src={car.image} alt={car.name} onError={() => setImgError(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-xl">🚗</div>
      )}
    </div>
  );
}

export default function FleetTable({ rows = [] }) {
  const today = getToday();

  const fleet = cars.map((car) => {
    const own = rows.filter((r) => r.carId === car.id && r.status !== "cancelled");
    const upcoming = own
      .filter((r) => r.returnDate >= today)
      .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
    return {
      car,
      count: own.length,
      revenue: own.reduce((sum, r) => sum + r.total, 0),
      next: upcoming.length > 0 ? upcoming[0] : null,
    };
  });

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Car</th>
              <th className="px-4 py-3 font-semibold">Rate</th>
              <th className="px-4 py-3 font-semibold">Listing</th>
              <th className="px-4 py-3 font-semibold">Next booking</th>
              <th className="px-4 py-3 text-right font-semibold">Bookings</th>
              <th className="px-4 py-3 text-right font-semibold">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {fleet.map(({ car, count, revenue, next }) => (
              <tr key={car.id} className="border-t border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <CarThumb car={car} />
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white">{car.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{car.category}, {car.fuel}, {car.seats} seats</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">Rs. {car.pricePerDay.toLocaleString()} / day</td>
                <td className="px-4 py-4">
                  <span className={"inline-block rounded-full px-3 py-0.5 text-xs font-semibold ring-1 " + (car.available ? statusStyles.confirmed : statusStyles.cancelled)}>{car.available ? "Available" : "Unavailable"}</span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">{next ? formatDate(next.pickupDate) + " to " + formatDate(next.returnDate) : "None scheduled"}</td>
                <td className="px-4 py-4 text-right font-semibold text-slate-900 dark:text-white">{count}</td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-900 dark:text-white">Rs. {revenue.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Fleet listing (available or unavailable) is set in the car data file. Bookings and revenue exclude cancelled bookings.</p>
    </div>
  );
}