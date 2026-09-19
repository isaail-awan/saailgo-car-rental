import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import NotFound from "./pages/NotFound";
import useTheme from "./hooks/useTheme";
import { loadBookings, saveBookings, isActive } from "./utils/bookings";

export default function App() {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <ScrollToHash />
      <Navbar bookingCount={bookings.filter(isActive).length} dark={dark} onToggleTheme={toggleTheme} />

      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home bookings={bookings} onConfirm={addBooking} onCancel={cancelBooking} onClear={clearBookings} />} />
          <Route path="/cars/:id" element={<CarDetails bookings={bookings} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}