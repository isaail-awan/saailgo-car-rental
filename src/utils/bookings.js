const STORAGE_KEY = "saailgo-bookings";

export function getToday() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split("T")[0];
}

export function loadBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

export function saveBookings(bookings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error("Could not save bookings", err);
  }
}

export function shortDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// Cancelled bookings ke dates free ho jate hain
export function isActive(booking) {
  return booking.status !== "cancelled";
}

// Kisi car ki aane wali (ya chal rahi) active bookings
export function getUpcomingBookings(bookings, carId) {
  const today = getToday();
  return bookings
    .filter((b) => isActive(b) && b.carId === carId && b.returnDate >= today)
    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate));
}

// Overlap check: return wale din naya pick-up allowed hai
export function findConflict(bookings, carId, pickupDate, returnDate) {
  if (!carId || !pickupDate || !returnDate) return null;
  if (returnDate <= pickupDate) return null;
  const found = bookings.find((b) => isActive(b) && b.carId === carId && pickupDate < b.returnDate && b.pickupDate < returnDate);
  return found || null;
}