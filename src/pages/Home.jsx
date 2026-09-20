import { useState } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import CarList from "../components/CarList";
import BookingForm from "../components/BookingForm";
import BookingHistory from "../components/BookingHistory";

export default function Home({ bookings, myBookings, onConfirm, onCancel, onClear }) {
  const location = useLocation();

  // Details page ya login ke baad car pehle se select ho
  const [bookingRequest, setBookingRequest] = useState(() => {
    const carId = location.state && location.state.carId;
    return carId ? { carId, stamp: location.state.stamp } : null;
  });

  const handleBook = (carId) => {
    setBookingRequest({ carId, stamp: Date.now() });
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Hero />
      <CarList onBook={handleBook} bookings={bookings} />
      <BookingForm bookingRequest={bookingRequest} bookings={bookings} onConfirm={onConfirm} />
      <BookingHistory bookings={myBookings} onCancel={onCancel} onClear={onClear} />
    </>
  );
}