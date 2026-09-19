import { useState } from "react";
import cars from "../data/cars";
import { brand } from "../data/brand";
import BookingConfirmation from "./BookingConfirmation";
import { getToday, shortDate, getUpcomingBookings, findConflict } from "../utils/bookings";

const availableCars = cars.filter((c) => c.available);

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  carId: "",
  pickupDate: "",
  returnDate: "",
  notes: "",
};

function getDays(pickup, ret) {
  if (!pickup || !ret) return 0;
  const diff = (new Date(ret) - new Date(pickup)) / 86400000;
  return diff > 0 ? diff : 0;
}

function validate(form) {
  const errors = {};
  const today = getToday();
  const phone = form.phone.replace(/[\s-]/g, "");

  if (form.name.trim().length < 3) {
    errors.name = "Please enter your full name (at least 3 characters).";
  } else if (!/^[A-Za-z\s.'-]+$/.test(form.name.trim())) {
    errors.name = "Name can only contain letters and spaces.";
  }

  if (!/^(03\d{9}|\+923\d{9})$/.test(phone)) {
    errors.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.carId) {
    errors.carId = "Please select a car.";
  }

  if (!form.pickupDate) {
    errors.pickupDate = "Please select a pick-up date.";
  } else if (form.pickupDate < today) {
    errors.pickupDate = "Pick-up date cannot be in the past.";
  }

  if (!form.returnDate) {
    errors.returnDate = "Please select a return date.";
  } else if (form.pickupDate && form.returnDate <= form.pickupDate) {
    errors.returnDate = "Return date must be after the pick-up date.";
  }

  return errors;
}

const inputClass = (hasError) =>
  "w-full rounded-lg border bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 " +
  (hasError
    ? "border-red-400 focus:ring-red-200 dark:focus:ring-red-500/30"
    : "border-slate-300 focus:border-amber-400 focus:ring-amber-400/30 dark:border-slate-700");

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default function BookingForm({ bookingRequest, bookings = [], onConfirm }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);

  // Jab card ke "Book Now" par click ho to car khud select ho jaye
  if (bookingRequest && bookingRequest !== lastRequest) {
    setLastRequest(bookingRequest);
    setForm((prev) => ({ ...prev, carId: String(bookingRequest.carId) }));
    setErrors((prev) => ({ ...prev, carId: "" }));
    setBooking(null);
  }

  const today = getToday();
  const selectedCar = cars.find((c) => String(c.id) === form.carId);
  const days = getDays(form.pickupDate, form.returnDate);
  const total = selectedCar ? days * selectedCar.pricePerDay : 0;

  const carBookings = selectedCar ? getUpcomingBookings(bookings, selectedCar.id) : [];
  const conflict = selectedCar ? findConflict(bookings, selectedCar.id, form.pickupDate, form.returnDate) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    const cleared = { ...errors, [name]: "" };
    if (name === "pickupDate") cleared.returnDate = "";
    setErrors(cleared);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);

    if (Object.keys(found).length === 0 && !conflict) {
      const newBooking = {
        id: "SG-" + Math.floor(100000 + Math.random() * 900000),
        carId: selectedCar.id,
        pickupDate: form.pickupDate,
        returnDate: form.returnDate,
        name: form.name.trim(),
        phone: form.phone,
        total,
      };

      if (onConfirm) onConfirm(newBooking);

      setBooking({
        id: newBooking.id,
        car: selectedCar,
        days,
        total,
        form,
      });
    }
  };

  const handleReset = () => {
    setForm(emptyForm);
    setErrors({});
    setBooking(null);
  };

  if (booking) {
    return <BookingConfirmation booking={booking} onReset={handleReset} />;
  }

  return (
    <section id="booking" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-20">
      <div className="grid gap-12 lg:grid-cols-5 items-start">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">Reservation</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Book your car</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Fill in the form and send your request. The {brand.first}{brand.second} team will confirm your booking shortly.
          </p>

          <ul className="mt-8 space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3"><span>1️⃣</span><span>Choose your car and rental dates</span></li>
            <li className="flex gap-3"><span>2️⃣</span><span>Enter your contact details</span></li>
            <li className="flex gap-3"><span>3️⃣</span><span>Get confirmation from our team</span></li>
          </ul>

          <div className="mt-8 rounded-xl bg-slate-900 p-5 text-slate-300 text-sm dark:ring-1 dark:ring-slate-800">
            <p className="font-semibold text-white">Need help?</p>
            <p className="mt-1">Call us: {brand.phone}</p>
            <p>Email: {brand.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="lg:col-span-3 rounded-2xl bg-white p-6 md:p-8 shadow-lg ring-1 ring-slate-200 space-y-5 dark:bg-slate-900 dark:ring-slate-800">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" id="name" error={errors.name}>
              <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClass(errors.name)} />
            </Field>

            <Field label="Phone number" id="phone" error={errors.phone}>
              <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="0300 1234567" className={inputClass(errors.phone)} />
            </Field>
          </div>

          <Field label="Email" id="email" error={errors.email}>
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass(errors.email)} />
          </Field>

          <Field label="Select car" id="carId" error={errors.carId}>
            <select id="carId" name="carId" value={form.carId} onChange={handleChange} className={inputClass(errors.carId)}>
              <option value="">Choose a car...</option>
              {availableCars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.name} (Rs. {car.pricePerDay.toLocaleString()} / day)
                </option>
              ))}
            </select>
            {carBookings.length > 0 && (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Already booked: {carBookings.map((b) => shortDate(b.pickupDate) + " to " + shortDate(b.returnDate)).join(", ")}
              </p>
            )}
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Pick-up date" id="pickupDate" error={errors.pickupDate}>
              <input id="pickupDate" name="pickupDate" type="date" min={today} value={form.pickupDate} onChange={handleChange} className={inputClass(errors.pickupDate)} />
            </Field>

            <Field label="Return date" id="returnDate" error={errors.returnDate}>
              <input id="returnDate" name="returnDate" type="date" min={form.pickupDate || today} value={form.returnDate} onChange={handleChange} className={inputClass(errors.returnDate)} />
            </Field>
          </div>

          {conflict && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">
              <p className="font-semibold">Not available on these dates</p>
              <p className="mt-1">
                {selectedCar.name} is already booked from {shortDate(conflict.pickupDate)} to {shortDate(conflict.returnDate)}. Please choose different dates or another car.
              </p>
            </div>
          )}

          <Field label="Special requests (optional)" id="notes">
            <textarea id="notes" name="notes" rows="3" value={form.notes} onChange={handleChange} placeholder="Child seat, airport pickup, etc." className={inputClass(false)} />
          </Field>

          {selectedCar && days > 0 && !conflict && (
            <div className="rounded-xl bg-amber-50 p-4 text-sm text-slate-700 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:text-slate-300 dark:ring-amber-400/30">
              {days} day(s) x Rs. {selectedCar.pricePerDay.toLocaleString()} ={" "}
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">Rs. {total.toLocaleString()}</span>
            </div>
          )}

          <button type="submit" disabled={Boolean(conflict)} className="w-full rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none dark:disabled:bg-slate-800">
            Submit booking request
          </button>
        </form>
      </div>
    </section>
  );
}