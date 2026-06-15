import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProducts from "../hooks/useProducts";
import CategoryIcon from "../components/UI/CategoryIcon";
import { createOrderAPI } from "../features/orders/ordersAPI";

const ProductDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
    clearCurrentProduct,
  } = useProducts();

  useEffect(() => {
    fetchProductById(id);
    return () => clearCurrentProduct();
  }, [id, fetchProductById, clearCurrentProduct]);

  const [orderState, setOrderState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const handleRequestRent = async () => {
    setOrderState({ loading: true, error: null, success: false });
    try {
      await createOrderAPI({
        products: [
          {
            productId: selectedProduct._id,
            name: selectedProduct.name,
            price: selectedProduct.monthlyRentalPrice,
            quantity: 1,
          },
        ],
      });
      setOrderState({ loading: false, error: null, success: true });
    } catch (err) {
      setOrderState({
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

  return (
    <div>
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-violet"
      >
        <span aria-hidden="true">←</span> Back to listings
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* Image */}
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

        {/* Details */}
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
                {orderState.success ? (
                  <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    Request sent! We'll get back to you soon.
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleRequestRent}
                    disabled={orderState.loading || !isAvailableForRent}
                    className="rounded-lg bg-violet px-6 py-3 text-sm font-medium text-white transition hover:bg-violet/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {orderState.loading
                      ? "Sending request..."
                      : "Request to rent"}
                  </button>
                )}

                {orderState.error && (
                  <p className="mt-2 text-xs text-coral">{orderState.error}</p>
                )}
              </>
            ) : (
              <Link
                to="/login"
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
