import { useState } from "react";
import { formatDate } from "../../utils/status";

export default function CustomersTable({ customers = [], rows = [] }) {
  const [search, setSearch] = useState("");

  const list = customers.map((c) => {
    const own = rows.filter((r) => r.userId === c.id);
    const spent = own.filter((r) => r.status !== "cancelled").reduce((sum, r) => sum + r.total, 0);
    return { ...c, bookingCount: own.length, spent };
  });

  const query = search.trim().toLowerCase();
  const filtered = list.filter((c) => !query || (c.name + " " + c.email + " " + c.phone).toLowerCase().includes(query));

  return (
    <div>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or phone..." className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500" />

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Joined</th>
              <th className="px-4 py-3 text-right font-semibold">Bookings</th>
              <th className="px-4 py-3 text-right font-semibold">Total spent</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center text-slate-500 dark:text-slate-400">
                  <p className="text-4xl">👥</p>
                  <p className="mt-3 font-semibold text-slate-900 dark:text-white">{customers.length === 0 ? "No customers yet" : "No customers found"}</p>
                  <p className="mt-1">{customers.length === 0 ? "Registered accounts will appear here." : "Try a different search."}</p>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-t border-slate-100 transition hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-900">{c.name.trim().charAt(0).toUpperCase()}</span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-900 dark:text-white">{c.name}</p>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{c.phone || "-"}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-700 dark:text-slate-300">{c.createdAt ? formatDate(c.createdAt.slice(0, 10)) : "-"}</td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900 dark:text-white">{c.bookingCount}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-right font-semibold text-slate-900 dark:text-white">Rs. {c.spent.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{filtered.length} {filtered.length === 1 ? "customer" : "customers"}</p>
    </div>
  );
}