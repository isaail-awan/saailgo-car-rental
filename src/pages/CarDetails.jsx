import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import cars from "../data/cars";
import { getCarDetails } from "../data/carDetails";
import { brand } from "../data/brand";
import CarCard from "../components/CarCard";
import NotFound from "./NotFound";
import { shortDate, getUpcomingBookings } from "../utils/bookings";

function Spec({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function CarDetailsView({ car, bookings }) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const info = getCarDetails(car);
  const carBookings = getUpcomingBookings(bookings, car.id);
  const hasBookings = car.available && carBookings.length > 0;

  const statusLabel = !car.available ? "Booked" : hasBookings ? "Partly booked" : "Available";
  const statusClass = !car.available ? "bg-red-500 text-white" : hasBookings ? "bg-amber-500 text-white" : "bg-green-500 text-white";

  useEffect(() => {
    const previous = document.title;
    document.title = car.name + " | " + brand.first + brand.second;
    return () => {
      document.title = previous;
    };
  }, [car.name]);

  const handleBook = (carId) => {
    navigate("/#booking", { state: { carId, stamp: Date.now() } });
  };

  const sameCategory = cars.filter((c) => c.id !== car.id && c.category === car.category);
  const others = cars.filter((c) => c.id !== car.id && c.category !== car.category);
  const similar = [...sameCategory, ...others].slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link to="/#cars" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-amber-500 dark:text-slate-400">← Back to all cars</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-200 to-slate-300 shadow-lg ring-1 ring-slate-200 dark:from-slate-700 dark:to-slate-800 dark:ring-slate-800">
          {!imgError ? (
            <img src={car.image} alt={car.name} onError={() => setImgError(true)} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl">🚗</div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-slate-900/80 px-4 py-1 text-sm font-medium text-white">{car.category}</span>
          <span className={"absolute right-4 top-4 rounded-full px-4 py-1 text-sm font-semibold " + statusClass}>{statusLabel}</span>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">{car.category}</p>
          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">{car.name}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">{info.description}</p>

          <p className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">
            Rs. {car.pricePerDay.toLocaleString()}
            <span className="text-lg font-normal text-slate-500 dark:text-slate-400"> / day</span>
          </p>

          {hasBookings && (
            <div className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-300 dark:ring-amber-400/30">
              <p className="font-semibold">Already booked on these dates:</p>
              <ul className="mt-1 space-y-0.5">
                {carBookings.map((b) => (
                  <li key={b.id}>{shortDate(b.pickupDate)} to {shortDate(b.returnDate)}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4">
            {car.available ? (
              <button onClick={() => handleBook(car.id)} className="rounded-lg bg-amber-400 px-8 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300">Book this car</button>
            ) : (
              <span className="cursor-not-allowed rounded-lg bg-slate-200 px-8 py-3 font-semibold text-slate-500 dark:bg-slate-800">Currently unavailable</span>
            )}
            <Link to="/#cars" className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Browse other cars</Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Spec label="Category" value={car.category} />
            <Spec label="Fuel type" value={car.fuel} />
            <Spec label="Seating" value={car.seats + " seats"} />
            <Spec label="Transmission" value={info.transmission} />
            <Spec label="Engine" value={info.engine} />
            <Spec label="Best for" value={info.idealFor} />
          </div>
        </div>
      </div>

      {/* Features and policy */}
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Features</h2>
          <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
            {info.features.map((f) => (
              <li key={f} className="flex items-center gap-3"><span className="text-green-500">✔</span>{f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Rental policy</h2>
          <ul className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-3"><span className="text-amber-500">●</span>Free cancellation up to 24 hours before pick-up</li>
            <li className="flex items-center gap-3"><span className="text-amber-500">●</span>Minimum rental period is 1 day</li>
            <li className="flex items-center gap-3"><span className="text-amber-500">●</span>Valid CNIC and driving license required at pick-up</li>
            <li className="flex items-center gap-3"><span className="text-amber-500">●</span>Return the car with the same fuel level</li>
          </ul>
        </div>
      </div>

      {/* Similar cars */}
      {similar.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">You may also like</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((c) => (
              <CarCard key={c.id} car={c} onBook={handleBook} bookings={getUpcomingBookings(bookings, c.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CarDetails({ bookings = [] }) {
  const { id } = useParams();
  const car = cars.find((c) => String(c.id) === id);

  if (!car) return <NotFound />;

  // key lagane se doosri car par jane par page ki state (jaise image error) reset ho jati hai
  return <CarDetailsView key={car.id} car={car} bookings={bookings} />;
}