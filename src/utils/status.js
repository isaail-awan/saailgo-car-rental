export function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

export function daysBetween(a, b) {
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
}

// upcoming = abhi confirm nahi hui (pending), confirmed = admin ne confirm kar di
export function getStatus(booking, today) {
  if (booking.status === "cancelled") return "cancelled";
  if (booking.returnDate < today) return "completed";
  if (booking.pickupDate <= today) return "ongoing";
  return booking.status === "confirmed" ? "confirmed" : "upcoming";
}

export const STATUS_ORDER = ["upcoming", "confirmed", "ongoing", "completed", "cancelled"];

export const statusLabels = {
  upcoming: "Pending",
  confirmed: "Confirmed",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const statusStyles = {
  upcoming: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30",
  confirmed: "bg-green-50 text-green-700 ring-green-200 dark:bg-green-400/10 dark:text-green-300 dark:ring-green-400/30",
  ongoing: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-300 dark:ring-sky-400/30",
  completed: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-700/40 dark:text-slate-300 dark:ring-slate-600",
  cancelled: "bg-red-50 text-red-700 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30",
};

export const statusDots = {
  upcoming: "bg-amber-400",
  confirmed: "bg-green-500",
  ongoing: "bg-sky-500",
  completed: "bg-slate-400",
  cancelled: "bg-red-500",
};