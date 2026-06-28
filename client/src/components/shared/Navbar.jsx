import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main navbar ── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4 border-b border-line bg-white/90 backdrop-blur-sm">
        {/* Logo */}
        <Link
          to="/"
          onClick={close}
          className="font-display text-lg font-semibold text-ink tracking-tight hover:text-violet transition"
        >
          RentEase
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/products"
            className="text-sm text-muted hover:text-ink transition"
          >
            Products
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-orders"
                className="text-sm text-muted hover:text-ink transition"
              >
                My Orders
              </Link>
              <Link
                to="/maintenance"
                className="text-sm text-muted hover:text-ink transition"
              >
                Maintenance
              </Link>
              <Link
                to="/profile"
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:border-violet/50 hover:text-violet transition"
              >
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-lg border border-violet/40 px-4 py-2 text-sm font-medium text-violet hover:bg-violet hover:text-white transition"
                >
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-muted hover:text-ink transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-violet px-4 py-2 text-sm font-medium text-white hover:bg-violet/90 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-0.5 w-5 bg-ink transition-all duration-300 origin-center ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-ink transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-5 bg-ink transition-all duration-300 origin-center ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* ── Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-ink/20 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={close}
      />

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line">
          <span className="font-display text-lg font-semibold text-ink">
            RentEase
          </span>
          <button
            onClick={close}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:bg-paper hover:text-ink transition text-2xl leading-none"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Drawer links */}
        <div className="flex flex-col px-4 py-6 gap-1">
          <Link
            to="/products"
            onClick={close}
            className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-paper hover:text-violet transition"
          >
            Products
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-orders"
                onClick={close}
                className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-paper hover:text-violet transition"
              >
                My Orders
              </Link>
              <Link
                to="/maintenance"
                onClick={close}
                className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-paper hover:text-violet transition"
              >
                Maintenance
              </Link>
              <Link
                to="/profile"
                onClick={close}
                className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-paper hover:text-violet transition"
              >
                {user?.name?.split(" ")[0] || "Profile"}
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={close}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-violet hover:bg-violet/10 transition"
                >
                  Admin dashboard
                </Link>
              )}
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={close}
                className="px-4 py-3 rounded-xl text-sm font-medium text-ink hover:bg-paper hover:text-violet transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={close}
                className="mt-2 rounded-xl bg-violet px-4 py-3 text-sm font-medium text-white text-center hover:bg-violet/90 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Drawer footer */}
        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-line">
            <p className="font-tag text-[10px] uppercase tracking-[0.15em] text-muted">
              Signed in as
            </p>
            <p className="mt-1 text-sm font-medium text-ink truncate">
              {user?.email}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
