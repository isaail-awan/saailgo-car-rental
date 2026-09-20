import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToHash from "./components/ScrollToHash";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import { loadBookings, saveBookings, isActive } from "./utils/bookings";

export default function App() {
  const [bookings, setBookings] = useState(loadBookings);
  const [dark, toggleTheme] = useTheme();
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  // Sirf login user ki apni bookings (history ke liye)
  const myBookings = user ? bookings.filter((b) => b.userId === user.id) : [];

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const cancelBooking = (id) => {
    if (!user) return;
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id && b.userId === user.id
          ? { ...b, status: "cancelled", cancelledAt: new Date().toISOString(), cancelledBy: { userId: user.id, name: user.name, role: "customer" } }
          : b
      )
    );
  };

  const clearBookings = () => {
    if (!user) return;
    setBookings((prev) => prev.filter((b) => b.userId !== user.id));
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <ScrollToHash />
      <Navbar bookingCount={myBookings.filter(isActive).length} dark={dark} onToggleTheme={toggleTheme} />

      <main className="pt-16">
        <div key={location.pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home bookings={bookings} myBookings={myBookings} onConfirm={addBooking} onCancel={cancelBooking} onClear={clearBookings} />} />
            <Route path="/cars/:id" element={<CarDetails bookings={bookings} />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>

      <Footer />
    </div>
  );
}