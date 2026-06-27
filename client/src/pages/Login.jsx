import { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading, error, isAuthenticated, initializing } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (initializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-muted">Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch {
      // error already in Redux store
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-line bg-white p-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Welcome back
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          Log in to RentEase
        </h1>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-violet py-2.5 text-sm font-medium text-white transition hover:bg-violet/90 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-violet hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
