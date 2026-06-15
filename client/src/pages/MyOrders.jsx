import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserOrdersAPI } from '../features/orders/ordersAPI'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-violet/10 text-violet',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-coral/10 text-coral',
}

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await getUserOrdersAPI()
        setOrders(result.data.orders)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const isEmpty = !loading && !error && orders.length === 0

  return (
    <div>
      <header className="mb-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Account
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          My orders
        </h1>
      </header>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-line/40" />
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
            No orders yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Once you request a rental, it&apos;ll show up here.
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block text-sm font-medium text-violet"
          >
            Browse products →
          </Link>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-line bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  Order #{order._id.slice(-6).toUpperCase()} ·{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    STATUS_STYLES[order.status] || 'bg-line/40 text-muted'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-1">
                {order.products.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between text-sm text-ink"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.price.toLocaleString('en-IN')}/mo</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="text-sm font-medium text-ink">Total</span>
                <span className="font-display text-base font-semibold text-ink">
                  ₹{order.totalPrice.toLocaleString('en-IN')}/mo
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyOrders