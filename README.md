<p align="center">
  <img src="docs/saailgo-logo-light.png" alt="SaailGo logo" width="320" />
</p>

<h3 align="center">A modern, responsive car rental website</h3>

<p align="center">
  Built with React, Vite and Tailwind CSS as part of the Sqrock IT Solutions web development internship (Project Phase 1).
</p>

## Live Demo

Add your Vercel link here.

## Features

- Responsive homepage with hero section, animated stats and call-to-action buttons
- Car listing with image, price per day, fuel type, seating capacity and availability status
- Search by car name, filter by category, fuel type and maximum price, plus an "available only" toggle
- Car details page for every car (specs, features, rental policy, booked dates and similar cars)
- Booking form with validation (name, Pakistani mobile number, email, car and rental dates)
- Live price calculation and double-booking protection (overlapping dates are blocked)
- Booking confirmation ticket with copyable booking ID and print option
- Booking history with upcoming, ongoing, completed and cancelled statuses
- Demo login and signup (accounts and bookings are stored in the browser only)
- Dark mode with saved preference
- Scroll animations and micro-interactions, with support for reduced-motion settings
- Fully responsive on mobile, tablet and desktop
- Demo admin dashboard with overview stats, booking confirmation/cancellation, customers and fleet views, and CSV export (demo admin: `admin@saailgo.com` / `Admin@123`)

## Tech Stack

- React (Vite)
- React Router
- Tailwind CSS
- JavaScript (ES6+)
- LocalStorage for bookings, accounts and theme

## Getting Started

    npm install
    npm run dev

## Build

    npm run build

## Project Structure

    src/
      components/   Navbar, Hero, CarList, CarCard, BookingForm, BookingConfirmation, BookingHistory, Logo, Footer
      pages/        Home, CarDetails, AuthPage, NotFound
      context/      AuthProvider
      hooks/        useTheme, useAuth
      data/         cars.js, carDetails.js, brand.js
      utils/        bookings.js, auth.js, motion.js
    public/
      images/cars/  Car images
    docs/           Logo and documentation images

## Note

This is a frontend-only demo. There is no backend or database, so login accounts and bookings are saved only in the visitor's own browser (localStorage).

## Author

Saail Abbas