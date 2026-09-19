import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarList from "./components/CarList";
import BookingForm from "./components/BookingForm";
import BookingHistory from "./components/BookingHistory";
import Footer from "./components/Footer";
import useTheme from "./hooks/useTheme";
import { loadBookings, saveBookings, isActive } from "./utils/bookings";

export default function App() {
  const [bookingRequest, setBookingRequest] = useState(null);
  const [bookings, setBookings] = useState(loadBookings);
  const [dark, toggleTheme] = useTheme();

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const cancelBooking = (id) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled", cancelledAt: new Date().toISOString() } : b)));
  };

  const clearBookings = () => {
    setBookings([]);
  };

  const handleBook = (carId) => {
    setBookingRequest({ carId, stamp: Date.now() });
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <Navbar bookingCount={bookings.filter(isActive).length} dark={dark} onToggleTheme={toggleTheme} />

      <main className="pt-16">
        <Hero />
        <CarList onBook={handleBook} bookings={bookings} />
        <BookingForm bookingRequest={bookingRequest} bookings={bookings} onConfirm={addBooking} />
        <BookingHistory bookings={bookings} onCancel={cancelBooking} onClear={clearBookings} />
      </main>

      <Footer />
    </div>
  );
}