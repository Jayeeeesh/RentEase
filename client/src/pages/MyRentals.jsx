import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cancelRentalAPI, getUserRentalsAPI } from '../features/rentals/rentalsAPI'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  active: 'bg-green-50 text-green-700',
  completed: 'bg-violet/10 text-violet',
  cancelled: 'bg-coral/10 text-coral',
}

const MyRentals = () => {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [cancellingId, setCancellingId] = useState(null)

  const fetchRentals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await getUserRentalsAPI()
      setRentals(result.data.rentals)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rentals')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRentals()
  }, [fetchRentals])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this rental request?')) return
    setCancellingId(id)
    try {
      await cancelRentalAPI(id)
      await fetchRentals()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel rental')
    } finally {
      setCancellingId(null)
    }
  }

  const isEmpty = !loading && !error && rentals.length === 0

  return (
    <div>
      <header className="mb-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Account
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          My rentals
        </h1>
      </header>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-line/40" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Something went wrong
          </p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      )}

      {isEmpty && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No rentals yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Browse products and request your first rental.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block text-sm font-medium text-violet"
          >
            Browse products →
          </Link>
        </div>
      )}

      {!loading && !error && rentals.length > 0 && (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental._id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-semibold text-ink">
                    {rental.product?.name || 'Product'}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {rental.product?.city} · {rental.tenureMonths} month
                    {rental.tenureMonths > 1 ? 's' : ''}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[rental.status] || 'bg-line/40 text-muted'
                  }`}
                >
                  {rental.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-muted">Start</dt>
                  <dd className="font-medium text-ink">
                    {new Date(rental.startDate).toLocaleDateString('en-IN')}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">End</dt>
                  <dd className="font-medium text-ink">
                    {new Date(rental.endDate).toLocaleDateString('en-IN')}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Monthly rent</dt>
                  <dd className="font-medium text-ink">
                    ₹{rental.product?.monthlyRentalPrice?.toLocaleString('en-IN')}/mo
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Total</dt>
                  <dd className="font-medium text-ink">
                    ₹{rental.totalAmount?.toLocaleString('en-IN')}
                  </dd>
                </div>
              </dl>

              {rental.status === 'pending' && (
                <button
                  type="button"
                  onClick={() => handleCancel(rental._id)}
                  disabled={cancellingId === rental._id}
                  className="mt-4 text-sm font-medium text-coral hover:underline disabled:opacity-50"
                >
                  {cancellingId === rental._id ? 'Cancelling...' : 'Cancel request'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRentals
