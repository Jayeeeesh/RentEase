import { useEffect, useState } from 'react'
import { getAllOrdersAPI, updateOrderStatusAPI } from '../../features/admin/adminAPI'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-violet/10 text-violet',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-coral/10 text-coral',
}

const NEXT_STATUS = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
}

const STATUS_LABEL = {
  processing: 'Mark Processing',
  shipped: 'Mark Shipped',
  delivered: 'Mark Delivered',
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getAllOrdersAPI({ limit: 100 })
        setOrders(res.data.orders || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3500)
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(orderId)
    try {
      await updateOrderStatusAPI(orderId, newStatus)
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      )
      showSuccess(`Order marked as ${newStatus}.`)
    } catch (err) {
      console.error('Status update failed:', err)
    } finally {
      setUpdating(null)
    }
  }

  const isEmpty = !loading && !error && orders.length === 0

  return (
    <div>
      {/* Success */}
      {successMsg && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          ✓ {successMsg}
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <p className="mb-6 text-sm text-muted">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-line/40" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            Something went wrong
          </p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      )}

      {/* Empty */}
      {isEmpty && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No orders yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Orders will appear here once users place them.
          </p>
        </div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl border border-line bg-white p-5 hover:border-violet/30 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted">
                    #{order._id.slice(-6).toUpperCase()} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>

                  <div className="mt-3 space-y-1">
                    {order.products.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between text-sm text-ink"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-muted">
                          ₹{item.price?.toLocaleString('en-IN')}/mo
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                    <span className="text-sm font-medium text-ink">Total</span>
                    <span className="font-display text-base font-semibold text-ink">
                      ₹{order.totalPrice?.toLocaleString('en-IN')}/mo
                    </span>
                  </div>
                </div>

                {/* Status + action */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[order.status] || 'bg-line/40 text-muted'
                    }`}
                  >
                    {order.status}
                  </span>

                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id, NEXT_STATUS[order.status])
                      }
                      disabled={updating === order._id}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-violet/40 hover:text-violet transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {updating === order._id
                        ? 'Updating...'
                        : STATUS_LABEL[NEXT_STATUS[order.status]]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminOrders