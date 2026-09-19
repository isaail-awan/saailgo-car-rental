import { useState } from "react";
import cars from "../data/cars";
import CarCard from "./CarCard";
import { getUpcomingBookings } from "../utils/bookings";

const categories = ["All", ...new Set(cars.map((c) => c.category))];
const fuels = ["All", ...new Set(cars.map((c) => c.fuel))];
const highestPrice = Math.max(...cars.map((c) => c.pricePerDay));

export default function CarList({ onBook, bookings = [] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [fuel, setFuel] = useState("All");
  const [maxPrice, setMaxPrice] = useState(highestPrice);
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filteredCars = cars.filter((car) => {
    const matchesSearch = car.name.toLowerCase().includes(search.trim().toLowerCase());
    const matchesCategory = category === "All" || car.category === category;
    const matchesFuel = fuel === "All" || car.fuel === fuel;
    const matchesPrice = car.pricePerDay <= maxPrice;
    const matchesAvailability = !onlyAvailable || car.available;
    return matchesSearch && matchesCategory && matchesFuel && matchesPrice && matchesAvailability;
  });

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setFuel("All");
    setMaxPrice(highestPrice);
    setOnlyAvailable(false);
  };

  return (
    <section id="cars" className="max-w-6xl mx-auto px-4 py-20 scroll-mt-16">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-500">Our Fleet</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-slate-900">Choose your ride</h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Pick from sedans, hatchbacks, SUVs and vans. All cars are regularly serviced and ready to go.
        </p>
      </div>

      {/* Search and filters */}
      <div className="mb-10 rounded-2xl bg-white p-5 shadow-md ring-1 ring-slate-200">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by car name or model..." className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30" />

        <div className="mt-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={"rounded-full px-4 py-1.5 text-sm font-medium transition " + (category === c ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-3 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fuel type</label>
            <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-amber-400">
              {fuels.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Max price: <span className="font-bold">Rs. {maxPrice.toLocaleString()}</span> / day
            </label>
            <input type="range" min="0" max={highestPrice} step="1000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-amber-500" />
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} className="h-4 w-4 accent-amber-500" />
              Available only
            </label>
            <button onClick={resetFilters} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Reset
            </button>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-slate-500">
        Showing {filteredCars.length} of {cars.length} cars
      </p>

      {filteredCars.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} onBook={onBook} bookings={getUpcomingBookings(bookings, car.id)} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white py-16 text-center shadow-md ring-1 ring-slate-200">
          <p className="text-5xl">🔍</p>
          <h3 className="mt-4 text-xl font-bold text-slate-900">No cars found</h3>
          <p className="mt-2 text-slate-600">Try changing your search or filters.</p>
          <button onClick={resetFilters} className="mt-6 rounded-lg bg-amber-400 px-5 py-2 font-semibold text-slate-900 transition hover:bg-amber-300">
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}