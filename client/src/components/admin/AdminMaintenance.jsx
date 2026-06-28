import { useEffect, useState } from 'react'
import {
  getAllMaintenanceAdminAPI,
  updateMaintenanceStatusAPI,
} from '../../features/admin/adminAPI'

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  'in-progress': 'bg-blue-50 text-blue-700',
  resolved: 'bg-green-50 text-green-700',
}

const PRIORITY_STYLES = {
  low: 'bg-line/40 text-muted',
  medium: 'bg-violet/10 text-violet',
  high: 'bg-coral/10 text-coral',
}

const NEXT_STATUS = {
  pending: 'in-progress',
  'in-progress': 'resolved',
}

const STATUS_LABEL = {
  'in-progress': 'Mark In-Progress',
  resolved: 'Mark Resolved',
}

const AdminMaintenance = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [adminNote, setAdminNote] = useState({})
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getAllMaintenanceAdminAPI({ limit: 100 })
        setRequests(res.data.maintenance || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load requests')
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3500)
  }

  const handleStatusUpdate = async (reqId, newStatus) => {
    setUpdating(reqId)
    try {
      await updateMaintenanceStatusAPI(reqId, {
        status: newStatus,
        adminNote: adminNote[reqId] || undefined,
      })
      setRequests((prev) =>
        prev.map((r) =>
          r._id === reqId
            ? { ...r, status: newStatus, adminNote: adminNote[reqId] || r.adminNote }
            : r
        )
      )
      setAdminNote((prev) => ({ ...prev, [reqId]: '' }))
      showSuccess(`Request marked as ${newStatus}.`)
    } catch (err) {
      console.error('Status update failed:', err)
    } finally {
      setUpdating(null)
    }
  }

  const isEmpty = !loading && !error && requests.length === 0

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
          {requests.length} request{requests.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-line/40" />
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
            No requests yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Maintenance requests from users will appear here.
          </p>
        </div>
      )}

      {/* Requests list */}
      {!loading && !error && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="rounded-2xl border border-line bg-white p-5 hover:border-violet/30 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Meta */}
                  <p className="text-xs text-muted">
                    #{req._id.slice(-6).toUpperCase()} ·{' '}
                    {new Date(req.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>

                  {/* Description */}
                  <p className="mt-2 text-sm text-ink leading-relaxed">
                    {req.description}
                  </p>

                  {/* Existing admin note */}
                  {req.adminNote && (
                    <p className="mt-2 text-xs text-muted italic border-l-2 border-violet/30 pl-3">
                      Admin note: {req.adminNote}
                    </p>
                  )}

                  {/* Admin note input — only if can update */}
                  {NEXT_STATUS[req.status] && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Add admin note (optional)..."
                        value={adminNote[req._id] || ''}
                        onChange={(e) =>
                          setAdminNote((prev) => ({
                            ...prev,
                            [req._id]: e.target.value,
                          }))
                        }
                        maxLength={300}
                        className="w-full rounded-xl border border-line px-4 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet/40"
                      />
                    </div>
                  )}

                  {/* Resolved at */}
                  {req.resolvedAt && (
                    <p className="mt-3 text-xs text-muted">
                      Resolved on{' '}
                      {new Date(req.resolvedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>

                {/* Badges + action */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[req.status] || 'bg-line/40 text-muted'
                    }`}
                  >
                    {req.status}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      PRIORITY_STYLES[req.priority] || 'bg-line/40 text-muted'
                    }`}
                  >
                    {req.priority}
                  </span>

                  {NEXT_STATUS[req.status] && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(req._id, NEXT_STATUS[req.status])
                      }
                      disabled={updating === req._id}
                      className="mt-1 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-violet/40 hover:text-violet transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {updating === req._id
                        ? 'Updating...'
                        : STATUS_LABEL[NEXT_STATUS[req.status]]}
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

export default AdminMaintenance