import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CarList from "./components/CarList";
import BookingForm from "./components/BookingForm";
import Footer from "./components/Footer";
import { loadBookings, saveBookings } from "./utils/bookings";

export default function App() {
  const [bookingRequest, setBookingRequest] = useState(null);
  const [bookings, setBookings] = useState(loadBookings);

  useEffect(() => {
    saveBookings(bookings);
  }, [bookings]);

  const addBooking = (booking) => {
    setBookings((prev) => [...prev, booking]);
  };

  const handleBook = (carId) => {
    setBookingRequest({ carId, stamp: Date.now() });
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Navbar />

      <main className="pt-16">
        <Hero />
        <CarList onBook={handleBook} bookings={bookings} />
        <BookingForm bookingRequest={bookingRequest} bookings={bookings} onConfirm={addBooking} />
      </main>

      <Footer />
    </div>
  );
}