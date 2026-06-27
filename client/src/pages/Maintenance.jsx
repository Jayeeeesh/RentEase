import { useEffect, useState } from 'react'
import { getUserMaintenanceAPI, createMaintenanceAPI, getUserRentalsAPI } from '../features/maintenance/maintenanceAPI'

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

const INITIAL_FORM = { rentalId: '', description: '', priority: 'medium' }

const Maintenance = () => {
  const [requests, setRequests] = useState([])
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [maintenanceRes, rentalsRes] = await Promise.all([
          getUserMaintenanceAPI(),
          getUserRentalsAPI(),
        ])
        setRequests(maintenanceRes.data.maintenance || [])
        setRentals(rentalsRes.data.rentals || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const refetch = async () => {
    try {
      const res = await getUserMaintenanceAPI()
      setRequests(res.data.maintenance || [])
    } catch {
      // silent refetch fail
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.rentalId) {
      setSubmitError('Please select a rental.')
      return
    }
    if (form.description.trim().length < 10) {
      setSubmitError('Description must be at least 10 characters.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      await createMaintenanceAPI(form)
      setSubmitSuccess(true)
      setForm(INITIAL_FORM)
      setShowForm(false)
      refetch()
      setTimeout(() => setSubmitSuccess(false), 4000)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit request.')
    } finally {
      setSubmitting(false)
    }
  }

  const isEmpty = !loading && !error && requests.length === 0

  return (
    <div>
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
            Support
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
            Maintenance requests
          </h1>
        </div>
        <button
          onClick={() => {
            setShowForm((p) => !p)
            setSubmitError(null)
          }}
          className="shrink-0 rounded-xl bg-violet px-4 py-2.5 text-sm font-medium text-white hover:bg-violet/90 transition"
        >
          {showForm ? 'Cancel' : '+ New request'}
        </button>
      </header>

      {/* Success banner */}
      {submitSuccess && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          ✓ Maintenance request submitted successfully.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-base font-semibold text-ink mb-5">
            New maintenance request
          </h2>

          <div className="space-y-5">
            {/* Rental select */}
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-[0.15em] text-muted mb-1.5">
                Select rental
              </label>
              <select
                name="rentalId"
                value={form.rentalId}
                onChange={handleChange}
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40"
              >
                <option value="">-- Choose a rental --</option>
                {rentals.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.product?.name || `Rental #${r._id.slice(-6).toUpperCase()}`}
                  </option>
                ))}
              </select>
              {rentals.length === 0 && !loading && (
                <p className="mt-1.5 text-xs text-muted">
                  No active rentals found.
                </p>
              )}
            </div>

            {/* Priority */}
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-[0.15em] text-muted mb-1.5">
                Priority
              </label>
              <div className="flex gap-2">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                    className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${
                      form.priority === p
                        ? 'border-violet bg-violet text-white'
                        : 'border-line text-muted hover:border-violet/40 hover:text-ink'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-tag text-[10px] uppercase tracking-[0.15em] text-muted mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                placeholder="Describe the issue in detail (min. 10 characters)..."
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet/40 resize-none"
              />
              <p className={`mt-1 text-right font-tag text-[10px] ${form.description.length >= 480 ? 'text-coral' : 'text-muted'}`}>
                {form.description.length} / 500
              </p>
            </div>

            {/* Submit error */}
            {submitError && (
              <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
                {submitError}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setShowForm(false); setSubmitError(null) }}
                className="flex-1 rounded-xl border border-line py-3 text-sm font-medium text-muted hover:text-ink transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl bg-violet py-3 text-sm font-medium text-white hover:bg-violet/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
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
            Submit a maintenance request for any of your active rentals.
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
                  <p className="text-xs text-muted">
                    #{req._id.slice(-6).toUpperCase()} ·{' '}
                    {new Date(req.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="mt-2 text-sm text-ink leading-relaxed">
                    {req.description}
                  </p>
                  {req.adminNote && (
                    <p className="mt-3 text-xs text-muted italic border-l-2 border-violet/30 pl-3">
                      Admin note: {req.adminNote}
                    </p>
                  )}
                </div>

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
                </div>
              </div>

              {req.resolvedAt && (
                <p className="mt-3 border-t border-line pt-3 text-xs text-muted">
                  Resolved on{' '}
                  {new Date(req.resolvedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Maintenance