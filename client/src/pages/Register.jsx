import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [success, setSuccess] = useState(false);

  const { register, loading, error, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();

  if (initializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      password: form.password,
    };

    try {
      await register(payload);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch {
      // error in Redux
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-line bg-white p-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Get started
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          Create your account
        </h1>

        {success && (
          <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Account created! Redirecting to login...
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
              Full name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
              required
            />
          </div>
          <div>
            <label className="block font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
              required
            />
          </div>
          <div>
            <label className="block font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={handleChange}
              pattern="^[6-9]\d{9}$"
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
              required
            />
          </div>
          <div>
            <label className="block font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Min 8 chars, upper, lower & number"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$"
              title="Password must contain uppercase, lowercase and a number"
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full rounded-lg bg-violet py-2.5 text-sm font-medium text-white transition hover:bg-violet/90 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-violet hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
