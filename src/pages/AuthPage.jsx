import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { brand } from "../data/brand";
import useAuth from "../hooks/useAuth";
import Logo from "../components/Logo";

const perks = [
  "Book a car in a few clicks",
  "Track and cancel your bookings",
  "Your details filled in automatically",
  "Booking history saved on this device",
];

function validateSignup(f) {
  const e = {};
  const phone = f.phone.replace(/[\s-]/g, "");

  if (f.name.trim().length < 3) {
    e.name = "Please enter your full name (at least 3 characters).";
  } else if (!/^[A-Za-z\s.'-]+$/.test(f.name.trim())) {
    e.name = "Name can only contain letters and spaces.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    e.email = "Enter a valid email address.";
  }

  if (!/^(03\d{9}|\+923\d{9})$/.test(phone)) {
    e.phone = "Enter a valid mobile number, e.g. 0300 1234567.";
  }

  if (f.password.length < 8) {
    e.password = "Password must be at least 8 characters.";
  } else if (!/[A-Za-z]/.test(f.password) || !/\d/.test(f.password)) {
    e.password = "Use at least one letter and one number.";
  }

  if (f.confirm !== f.password) {
    e.confirm = "Passwords do not match.";
  }

  return e;
}

function validateLogin(f) {
  const e = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "Enter a valid email address.";
  if (!f.password) e.password = "Please enter your password.";
  return e;
}

function getStrength(p) {
  let score = 0;
  if (p.length >= 8) score++;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) score++;
  return score;
}

const strengthLabels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
const strengthColors = ["bg-slate-300 dark:bg-slate-700", "bg-red-500", "bg-amber-500", "bg-lime-500", "bg-green-500"];

const inputClass = (hasError, padding = "px-3") =>
  "w-full rounded-lg border bg-white " + padding + " py-2.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 " +
  (hasError
    ? "border-red-400 focus:ring-red-200 dark:focus:ring-red-500/30"
    : "border-slate-300 focus:border-amber-400 focus:ring-amber-400/30 dark:border-slate-700");

function Field({ label, id, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-300">{label}</label>
      {children}
      {error && <p className="anim-fade-in mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

function PasswordInput({ id, name, value, onChange, placeholder, hasError, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input id={id} name={name} type={show ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete} className={inputClass(hasError, "pl-3 pr-16")} />
      <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-slate-500 transition hover:text-amber-500 dark:text-slate-400">{show ? "Hide" : "Show"}</button>
    </div>
  );
}

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { user, signup, login } = useAuth();
  const location = useLocation();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login ke baad wapis wahin jayen jahan se aaye the (jaise booking form)
  const from = (location.state && location.state.from) || "/";
  const carState = location.state && location.state.carId ? { carId: location.state.carId, stamp: location.state.stamp } : undefined;

  if (user) return <Navigate to={from} replace state={carState} />;

  const strength = getStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = isSignup ? validateSignup(form) : validateLogin(form);
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    const result = isSignup
      ? await signup({ name: form.name, email: form.email, phone: form.phone, password: form.password })
      : await login({ email: form.email, password: form.password });
    setLoading(false);

    if (!result.ok) {
      if (result.field) setErrors({ [result.field]: result.error });
      else setFormError(result.error);
    }
  };

  return (
    <section className="px-4 py-12 md:py-16">
      <div className="anim-fade-up mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 lg:grid-cols-2 dark:bg-slate-900 dark:ring-slate-800">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white lg:flex">
          <div className="anim-float-slow absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="anim-float-slow absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" style={{ animationDelay: "-6s" }} />

          <div className="relative">
            <Link to="/#home" aria-label="Go to home page" className="inline-block"><Logo textClass="text-2xl" markClass="h-11 w-11" /></Link>
            <h2 className="mt-10 text-3xl font-extrabold leading-tight">Your ride, <span className="text-amber-400">your way.</span></h2>
            <p className="mt-4 text-slate-300">Create an account to book cars faster and keep track of every rental in one place.</p>

            <ul className="mt-8 space-y-3 text-slate-300">
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-3"><span className="text-amber-400">✔</span>{p}</li>
              ))}
            </ul>
          </div>

          <p className="relative text-sm text-slate-400">© {new Date().getFullYear()} {brand.first}{brand.second}</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">{isSignup ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{isSignup ? "Join " + brand.first + brand.second + " to book cars and manage your rentals." : "Log in to book cars and see your bookings."}</p>

          {formError && (
            <div className="anim-shake mt-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-red-200 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/30">{formError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
            {isSignup && (
              <Field label="Full name" id="name" error={errors.name}>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" autoComplete="name" className={inputClass(errors.name)} />
              </Field>
            )}

            <Field label="Email" id="email" error={errors.email}>
              <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" className={inputClass(errors.email)} />
            </Field>

            {isSignup && (
              <Field label="Phone number" id="phone" error={errors.phone}>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="0300 1234567" autoComplete="tel" className={inputClass(errors.phone)} />
              </Field>
            )}

            <Field label="Password" id="password" error={errors.password}>
              <PasswordInput id="password" name="password" value={form.password} onChange={handleChange} placeholder={isSignup ? "At least 8 characters" : "Your password"} hasError={errors.password} autoComplete={isSignup ? "new-password" : "current-password"} />

              {isSignup && form.password && (
                <div className="anim-fade-in mt-2">
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className={"h-1.5 flex-1 rounded-full transition-colors duration-300 " + (i <= strength ? strengthColors[strength] : "bg-slate-200 dark:bg-slate-700")} />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Strength: {strengthLabels[strength]}</p>
                </div>
              )}
            </Field>

            {isSignup && (
              <Field label="Confirm password" id="confirm" error={errors.confirm}>
                <PasswordInput id="confirm" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Re-enter your password" hasError={errors.confirm} autoComplete="new-password" />
              </Field>
            )}

            <button type="submit" disabled={loading} className="w-full rounded-lg bg-amber-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-amber-400/20 transition hover:bg-amber-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
            {isSignup ? "Already have an account? " : "New to " + brand.first + brand.second + "? "}
            <Link to={isSignup ? "/login" : "/signup"} state={location.state} className="font-semibold text-amber-600 transition hover:text-amber-500 dark:text-amber-400">{isSignup ? "Log in" : "Create an account"}</Link>
          </p>

          <p className="mt-6 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            Demo project: accounts are stored only in this browser and are not sent to any server. Please do not use a real password.
          </p>
        </div>
      </div>
    </section>
  );
}