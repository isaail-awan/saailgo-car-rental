import { useState } from "react";
import { STATUS_ORDER, statusLabels, statusStyles, formatDate, formatDateTime } from "../../utils/status";

function exportCsv(rows) {
  const header = ["Booking ID", "Customer", "Phone", "Car", "Pick-up", "Return", "Days", "Total (Rs.)", "Status"];
  const quote = (value) => '"' + String(value ?? "").replace(/"/g, '""') + '"';
  const lines = rows.map((r) =>
    [r.id, r.customer, r.phone || "", r.car ? r.car.name : "", r.pickupDate, r.returnDate, r.days, r.total, statusLabels[r.status]].map(quote).join(",")
  );
  const csv = [header.map(quote).join(","), ...lines].join("\n");

  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "saailgo-bookings.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function BookingsTable({ rows, onConfirm, onCancel }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [cancelId, setCancelId] = useState(null);

  const query = search.trim().toLowerCase();
  const filtered = rows.filter((r) => {
    const matchesFilter = filter === "all" || r.status === filter;
    const text = [r.id, r.customer, r.phone || "", r.car ? r.car.name : ""].join(" ").toLowerCase();
    return matchesFilter && (!query || text.includes(query));
  });

  const filters = ["all", ...STATUS_ORDER];
  const countFor = (key) => (key === "all" ? rows.length : rows.filter((r) => r.status === key).length);

  const handleCancel = (id) => {
    onCancel(id);
    setCancelId(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, customer, phone or car..." className="min-w-[220px] flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500" />
        <button onClick={() => exportCsv(filtered)} disabled={filtered.length === 0} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Export CSV</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={"rounded-full px-4 py-1.5 text-sm font-medium transition active:scale-95 " + (filter === key ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-900" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700")}
          >
            {key === "all" ? "All" : statusLabels[key]} <span className="opacity-60">{countFor(key)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Booking</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Car</th>
              <th className="px-4 py-3 font-semibold">Dates</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-14 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-4xl">🔎</p>
                  <p className="mt-3 font-semibold text-slate-900 dark:text-white">No bookings found</p>
                  <p className="mt-1">Try a different search or status filter.</p>
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const canConfirm = r.status === "upcoming";
                const canCancel = r.status === "upcoming" || r.status === "confirmed";
                const isCancelled = r.status === "cancelled";

                return (
                  <tr key={r.id} className="border-t border-slate-100 align-top transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">{r.id}</td>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{r.customer}</p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{r.phone || "No phone"}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{r.car ? r.car.name : "Car"}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">
                      <p>{formatDate(r.pickupDate)}</p>
                      <p className="text-slate-400">to {formatDate(r.returnDate)}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{r.days} {r.days === 1 ? "day" : "days"}</p>
                    </td>
                    <td className={"whitespace-nowrap px-4 py-4 font-semibold " + (isCancelled ? "text-slate-400 line-through dark:text-slate-500" : "text-slate-900 dark:text-white")}>Rs. {r.total.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={"inline-block rounded-full px-3 py-0.5 text-xs font-semibold ring-1 " + statusStyles[r.status]}>{statusLabels[r.status]}</span>
                      {isCancelled && r.cancelledAt && (
                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                          {r.cancelledBy ? "By " + r.cancelledBy.name + (r.cancelledBy.role === "admin" ? " (admin)" : "") : "Cancelled"}
                          <br />
                          {formatDateTime(r.cancelledAt)}
                        </p>
                      )}
                      {r.status === "confirmed" && r.confirmedAt && <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{formatDateTime(r.confirmedAt)}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {cancelId === r.id ? (
                          <>
                            <button onClick={() => handleCancel(r.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 active:scale-95">Yes, cancel</button>
                            <button onClick={() => setCancelId(null)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Keep</button>
                          </>
                        ) : (
                          <>
                            {canConfirm && <button onClick={() => onConfirm(r.id)} className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-600 active:scale-95">Confirm</button>}
                            {canCancel && <button onClick={() => setCancelId(r.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 active:scale-95 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10">Cancel</button>}
                            {!canConfirm && !canCancel && <span className="text-slate-300 dark:text-slate-600">-</span>}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Showing {filtered.length} of {rows.length} bookings</p>
    </div>
  );
}