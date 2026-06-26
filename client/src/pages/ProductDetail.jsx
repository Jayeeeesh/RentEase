import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProducts from "../hooks/useProducts";
import CategoryIcon from "../components/UI/CategoryIcon";
import { createRentalAPI } from "../features/rentals/rentalsAPI";

const emptyAddress = { street: "", city: "", state: "", zipCode: "" };

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
    clearCurrentProduct,
  } = useProducts();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    tenureMonths: "",
    startDate: "",
    deliveryAddress: { ...emptyAddress },
  });
  const [rentalState, setRentalState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  useEffect(() => {
    fetchProductById(id);
    return () => clearCurrentProduct();
  }, [id, fetchProductById, clearCurrentProduct]);

  useEffect(() => {
    if (user?.address) {
      setForm((prev) => ({
        ...prev,
        deliveryAddress: {
          street: user.address.street || "",
          city: user.address.city || "",
          state: user.address.state || "",
          zipCode: user.address.pincode || "",
        },
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedProduct?.minTenureMonths) {
      setForm((prev) => ({
        ...prev,
        tenureMonths: String(selectedProduct.minTenureMonths),
      }));
    }
  }, [selectedProduct]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      deliveryAddress: { ...prev.deliveryAddress, [name]: value },
    }));
  };

  const handleSubmitRental = async (e) => {
    e.preventDefault();
    setRentalState({ loading: true, error: null, success: false });

    try {
      await createRentalAPI({
        productId: selectedProduct._id,
        tenureMonths: Number(form.tenureMonths),
        startDate: form.startDate,
        deliveryAddress: form.deliveryAddress,
      });
      setRentalState({ loading: false, error: null, success: true });
      setTimeout(() => navigate("/my-rentals"), 2000);
    } catch (err) {
      setRentalState({
        loading: false,
        error:
          err.response?.data?.message || "Something went wrong. Try again.",
        success: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="aspect-4/3 animate-pulse rounded-2xl bg-line/40" />
        <div className="space-y-4">
          <div className="h-4 w-1/3 animate-pulse rounded bg-line/40" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-line/40" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-line/40" />
          <div className="h-12 w-40 animate-pulse rounded bg-line/40" />
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center">
        <p className="font-display text-lg font-semibold text-ink">
          We couldn't find this product
        </p>
        <p className="mt-2 text-sm text-muted">
          {error || "It may have been removed or rented out."}
        </p>
        <Link
          to="/products"
          className="mt-4 inline-block text-sm font-medium text-violet"
        >
          ← Back to all products
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    images,
    category,
    subcategory,
    city,
    monthlyRentalPrice,
    securityDeposit,
    minTenureMonths,
    maxTenureMonths,
    isAvailableForRent,
  } = selectedProduct;

  const tenure = Number(form.tenureMonths) || minTenureMonths;
  const totalRent = monthlyRentalPrice * tenure;

  return (
    <div>
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-violet"
      >
        <span aria-hidden="true">←</span> Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-2xl bg-paper">
          {images?.[0]?.url ? (
            <img
              src={images[0].url}
              alt={images[0].alt || name}
              className="h-full w-full object-cover"
            />
          ) : (
            <CategoryIcon
              type={subcategory || category}
              className="h-20 w-20 text-violet/30"
            />
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="font-tag text-xs uppercase tracking-[0.15em] text-muted">
              {(subcategory || category)?.replace("_", " ")}
            </p>
            {!isAvailableForRent && (
              <span className="rounded-full bg-coral/10 px-3 py-1 font-tag text-[0.65rem] uppercase tracking-wide text-coral">
                Currently rented
              </span>
            )}
          </div>

          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">
            {name}
          </h1>
          <p className="mt-1 text-sm text-muted">{city}</p>

          <div className="mt-6">
            <span className="rental-tag rental-tag--lg">
              <span className="rental-tag__price">
                ₹{monthlyRentalPrice}
                <small>/mo</small>
              </span>
              <span className="rental-tag__meta">
                ₹{securityDeposit} refundable deposit
              </span>
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-line py-4 text-sm">
            <div>
              <dt className="text-muted">Minimum tenure</dt>
              <dd className="font-medium text-ink">
                {minTenureMonths} month{minTenureMonths > 1 ? "s" : ""}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Maximum tenure</dt>
              <dd className="font-medium text-ink">
                {maxTenureMonths} month{maxTenureMonths > 1 ? "s" : ""}
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            {description}
          </p>

          <div className="mt-8">
            {isAuthenticated ? (
              <>
                {rentalState.success ? (
                  <div className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    Rental request submitted! Redirecting to My Rentals...
                  </div>
                ) : showForm ? (
                  <form
                    onSubmit={handleSubmitRental}
                    className="space-y-4 rounded-2xl border border-line bg-paper p-5"
                  >
                    <h2 className="font-display text-lg font-semibold text-ink">
                      Rental details
                    </h2>

                    <div>
                      <label className="block text-xs uppercase tracking-wide text-muted mb-1">
                        Tenure (months)
                      </label>
                      <select
                        value={form.tenureMonths}
                        onChange={(e) =>
                          setForm({ ...form, tenureMonths: e.target.value })
                        }
                        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                        required
                      >
                        {Array.from(
                          { length: maxTenureMonths - minTenureMonths + 1 },
                          (_, i) => minTenureMonths + i
                        ).map((m) => (
                          <option key={m} value={m}>
                            {m} month{m > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wide text-muted mb-1">
                        Start date
                      </label>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) =>
                          setForm({ ...form, startDate: e.target.value })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                        required
                      />
                    </div>

                    <fieldset className="space-y-3">
                      <legend className="text-xs uppercase tracking-wide text-muted">
                        Delivery address
                      </legend>
                      <input
                        name="street"
                        placeholder="Street address"
                        value={form.deliveryAddress.street}
                        onChange={handleAddressChange}
                        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                        required
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="city"
                          placeholder="City"
                          value={form.deliveryAddress.city}
                          onChange={handleAddressChange}
                          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                          required
                        />
                        <input
                          name="state"
                          placeholder="State"
                          value={form.deliveryAddress.state}
                          onChange={handleAddressChange}
                          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                          required
                        />
                      </div>
                      <input
                        name="zipCode"
                        placeholder="PIN code"
                        pattern="^[1-9][0-9]{5}$"
                        value={form.deliveryAddress.zipCode}
                        onChange={handleAddressChange}
                        className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm"
                        required
                      />
                    </fieldset>

                    <div className="rounded-xl bg-white p-4 text-sm">
                      <div className="flex justify-between text-muted">
                        <span>Rent ({tenure} mo)</span>
                        <span>₹{totalRent.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-muted">
                        <span>Security deposit</span>
                        <span>₹{securityDeposit.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-line pt-2 font-medium text-ink">
                        <span>Total upfront</span>
                        <span>
                          ₹{(totalRent + securityDeposit).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={rentalState.loading || !isAvailableForRent}
                        className="flex-1 rounded-lg bg-violet px-6 py-3 text-sm font-medium text-white transition hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {rentalState.loading ? "Submitting..." : "Confirm rental"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="rounded-lg border border-line px-4 py-3 text-sm text-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>

                    {rentalState.error && (
                      <p className="text-xs text-coral">{rentalState.error}</p>
                    )}
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    disabled={!isAvailableForRent}
                    className="rounded-lg bg-violet px-6 py-3 text-sm font-medium text-white transition hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Request to rent
                  </button>
                )}
              </>
            ) : (
              <Link
                to="/login"
                state={{ from: { pathname: `/products/${id}` } }}
                className="inline-block rounded-lg bg-violet px-6 py-3 text-sm font-medium text-white transition hover:bg-violet/90"
              >
                Log in to request a rental
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
