import { useState } from "react";
import { Link } from "react-router-dom";
import cars from "../data/cars";
import useAuth from "../hooks/useAuth";
import { ADMIN_EMAIL, ADMIN_DEMO_PASSWORD } from "../data/adminAccount";
import { getToday } from "../utils/bookings";
import { getStatus, daysBetween } from "../utils/status";
import Overview from "../components/admin/Overview";
import BookingsTable from "../components/admin/BookingsTable";
import CustomersTable from "../components/admin/CustomersTable";
import FleetTable from "../components/admin/FleetTable";

function GateCard({ icon, title, children }) {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="anim-fade-up mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl ring-1 ring-amber-200 dark:bg-amber-400/10 dark:ring-amber-400/30">{icon}</div>
        <h1 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">{title}</h1>
        {children}
      </div>
    </section>
  );
}

export default function Admin({ bookings = [], onConfirm, onCancel }) {
  const { user, isAdmin, customers } = useAuth();
  const [tab, setTab] = useState("overview");

  if (!user) {
    return (
      <GateCard icon="🛡️" title="Admin access only">
        <p className="mt-2 text-slate-600 dark:text-slate-400">Log in with the admin account to manage bookings, customers and the fleet.</p>

        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-sm ring-1 ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
          <p className="font-semibold text-slate-900 dark:text-white">Demo admin account</p>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Email: <span className="font-mono text-slate-900 dark:text-white">{ADMIN_EMAIL}</span></p>
          <p className="text-slate-600 dark:text-slate-400">Password: <span className="font-mono text-slate-900 dark:text-white">{ADMIN_DEMO_PASSWORD}</span></p>
        </div>

        <Link to="/login" state={{ from: "/admin" }} className="mt-6 inline-block rounded-lg bg-amber-400 px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-95">Log in as admin</Link>
      </GateCard>
    );
  }

  if (!isAdmin) {
    return (
      <GateCard icon="⛔" title="Access denied">
        <p className="mt-2 text-slate-600 dark:text-slate-400">This page is only for administrators. Please log out and sign in with the admin account.</p>
        <Link to="/#home" className="mt-6 inline-block rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Back to home</Link>
      </GateCard>
    );
  }

  const today = getToday();
  const customerNames = {};
  customers.forEach((c) => {
    customerNames[c.id] = c.name;
  });

  // Har booking ko admin ke liye tayyar karein (naya se purana)
  const rows = [...bookings].reverse().map((b) => {
    const car = cars.find((c) => c.id === b.carId);
    const days = daysBetween(b.pickupDate, b.returnDate);
    const total = b.total ?? (car ? days * car.pricePerDay : 0);
    const customer = b.name || customerNames[b.userId] || "Unknown";
    return { ...b, car, days, total, customer, status: getStatus(b, today) };
  });

  const pendingCount = rows.filter((r) => r.status === "upcoming").length;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "bookings", label: "Bookings", badge: pendingCount },
    { key: "customers", label: "Customers" },
    { key: "fleet", label: "Fleet" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">Admin</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Signed in as {user.name}</p>
        </div>
        <Link to="/#home" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Back to website</Link>
      </div>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={"flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition active:scale-95 " + (tab === t.key ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-900" : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-800 dark:hover:bg-slate-800")}
          >
            {t.label}
            {t.badge > 0 && <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-bold text-slate-900">{t.badge}</span>}
          </button>
        ))}
      </div>

      <div key={tab} className="anim-fade-in mt-8">
        {tab === "overview" && <Overview rows={rows} customerCount={customers.length} onConfirm={onConfirm} onOpenBookings={() => setTab("bookings")} />}
        {tab === "bookings" && <BookingsTable rows={rows} onConfirm={onConfirm} onCancel={onCancel} />}
        {tab === "customers" && <CustomersTable customers={customers} rows={rows} />}
        {tab === "fleet" && <FleetTable rows={rows} />}
      </div>
    </div>
  );
}