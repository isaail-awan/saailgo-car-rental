import cars from "../../data/cars";
import Reveal from "../Reveal";
import CountUp from "../CountUp";
import { formatDate, STATUS_ORDER, statusLabels, statusDots } from "../../utils/status";

function StatCard({ label, value, prefix = "", hint, valueClass = "text-slate-900 dark:text-white" }) {
  return (
    <div className="h-full rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className={"mt-2 text-2xl font-extrabold md:text-3xl " + valueClass}><CountUp value={value} prefix={prefix} /></p>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>
    </div>
  );
}

export default function Overview({ rows, customerCount, onConfirm, onOpenBookings }) {
  const live = rows.filter((r) => r.status !== "cancelled");
  const revenue = live.reduce((sum, r) => sum + r.total, 0);
  const pending = rows.filter((r) => r.status === "upcoming");
  const cancelledCount = rows.length - live.length;

  const revenueByCar = cars
    .map((car) => {
      const own = live.filter((r) => r.carId === car.id);
      return { car, count: own.length, revenue: own.reduce((sum, r) => sum + r.total, 0) };
    })
    .filter((x) => x.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxRevenue = revenueByCar.length > 0 ? revenueByCar[0].revenue : 0;

  const statusCounts = STATUS_ORDER.map((key) => ({ key, count: rows.filter((r) => r.status === key).length }));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal animation="zoom" className="h-full"><StatCard label="Expected revenue" value={revenue} prefix="Rs. " hint="Excludes cancelled bookings" /></Reveal>
        <Reveal animation="zoom" delay={80} className="h-full"><StatCard label="Total bookings" value={rows.length} hint={cancelledCount + " cancelled"} /></Reveal>
        <Reveal animation="zoom" delay={160} className="h-full"><StatCard label="Pending confirmation" value={pending.length} hint="Waiting for your approval" valueClass="text-amber-500" /></Reveal>
        <Reveal animation="zoom" delay={240} className="h-full"><StatCard label="Customers" value={customerCount} hint="Registered accounts" /></Reveal>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Reveal className="h-full">
          <div className="h-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Revenue by car</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Top cars by booked value</p>

            {revenueByCar.length === 0 ? (
              <p className="mt-8 rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">No revenue yet. Bookings will show up here.</p>
            ) : (
              <ul className="mt-6 space-y-5">
                {revenueByCar.map((x) => (
                  <li key={x.car.id}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="font-medium text-slate-700 dark:text-slate-300">{x.car.name}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Rs. {x.revenue.toLocaleString()}</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-full rounded-full bg-amber-400 transition-all duration-700" style={{ width: (x.revenue / maxRevenue) * 100 + "%" }} />
                    </div>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{x.count} {x.count === 1 ? "booking" : "bookings"}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>

        <Reveal delay={100} className="h-full">
          <div className="h-full rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Bookings by status</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">How all bookings are distributed</p>

            {rows.length === 0 ? (
              <p className="mt-8 rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">No bookings yet.</p>
            ) : (
              <>
                <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  {statusCounts.filter((s) => s.count > 0).map((s) => (
                    <div key={s.key} className={"h-full transition-all duration-700 " + statusDots[s.key]} style={{ width: (s.count / rows.length) * 100 + "%" }} title={statusLabels[s.key] + ": " + s.count} />
                  ))}
                </div>

                <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3">
                  {statusCounts.map((s) => (
                    <li key={s.key} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><span className={"h-2.5 w-2.5 rounded-full " + statusDots[s.key]} />{statusLabels[s.key]}</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Awaiting confirmation</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">New booking requests that need your approval</p>
            </div>
            <button onClick={onOpenBookings} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">View all bookings</button>
          </div>

          {pending.length === 0 ? (
            <p className="mt-6 rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">All caught up. There are no pending requests.</p>
          ) : (
            <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {pending.slice(0, 5).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white">{r.car ? r.car.name : "Car"} <span className="ml-2 font-mono text-xs font-normal text-slate-400">{r.id}</span></p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{r.customer}, {formatDate(r.pickupDate)} to {formatDate(r.returnDate)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-900 dark:text-white">Rs. {r.total.toLocaleString()}</span>
                    <button onClick={() => onConfirm(r.id)} className="rounded-lg bg-green-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-green-600 active:scale-95">Confirm</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </div>
  );
}