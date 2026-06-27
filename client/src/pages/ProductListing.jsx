import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductCard from "../components/productCard/ProductCard";

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Furniture", value: "furniture" },
  { label: "Appliances", value: "appliance" },
];

const PAGE_TITLES = {
  furniture: "Furniture for rent",
  appliance: "Appliances for rent",
};

const ProductListing = () => {
  const { products, pagination, loading, error, fetchProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const city = searchParams.get("city") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [cityInput, setCityInput] = useState(city);

  useEffect(() => {
    const params = { page, limit: 9 };
    if (category) params.category = category;
    if (city) params.city = city;
    fetchProducts(params);
  }, [fetchProducts, category, city, page]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const handleCategoryChange = (value) => {
    updateParams({ category: value, page: null });
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    updateParams({ city: cityInput.trim() || null, page: null });
  };

  const isEmpty =
    !loading &&
    (error === "No products found" || (!error && products.length === 0));
  const isError = !loading && error && error !== "No products found";

  return (
    <div>
      <header className="mb-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Browse
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          {PAGE_TITLES[category] || "All products"}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, value }) => {
            const isActive = category === value || (!category && !value);
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleCategoryChange(value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  isActive
                    ? "border-violet bg-violet text-white"
                    : "border-line bg-white text-muted hover:border-violet/40 hover:text-ink"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleCitySearch} className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Filter by city (e.g. Mumbai)"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            className="flex-1 rounded-xl border border-line bg-white px-4 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40"
          />
          <button
            type="submit"
            className="rounded-xl bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink/90"
          >
            Search
          </button>
          {city && (
            <button
              type="button"
              onClick={() => {
                setCityInput("");
                updateParams({ city: null, page: null });
              }}
              className="rounded-xl border border-line px-4 py-2 text-sm text-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </form>
      </header>

      {loading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-4/3 animate-pulse rounded-2xl bg-line/40"
            />
          ))}
        </div>
      )}

      {!loading && isError && (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Something went wrong
          </p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      )}

      {!loading && isEmpty && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No products here yet
          </p>
          <p className="mt-2 text-sm text-muted">
            {category || city
              ? "We don't have any listings matching your filters."
              : "New listings are on the way — check back soon."}
          </p>
          {(category || city) && (
            <Link
              to="/products"
              className="mt-4 inline-block text-sm font-medium text-violet"
            >
              View all products →
            </Link>
          )}
        </div>
      )}

      {!loading && !isError && !isEmpty && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateParams({ page: String(page - 1) })}
                className="rounded-xl border border-line px-5 py-2 text-sm font-medium text-ink hover:border-violet/40 hover:text-violet transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="font-tag text-xs uppercase tracking-widest text-muted px-2">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
                className="rounded-xl border border-line px-5 py-2 text-sm font-medium text-ink hover:border-violet/40 hover:text-violet transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductListing;
