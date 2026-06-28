import { useEffect, useState } from 'react'
import {
  getAllProductsAdminAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from '../../features/admin/adminAPI'

const INITIAL_FORM = {
  name: '',
  category: 'furniture',
  subcategory: '',
  description: '',
  monthlyRentalPrice: '',
  securityDeposit: '',
  city: '',
  isAvailableForRent: true,
}

const Field = ({ label, children }) => (
  <div>
    <label className="block font-tag text-[10px] uppercase tracking-[0.15em] text-muted mb-1.5">
      {label}
    </label>
    {children}
  </div>
)

const inputClass =
  'w-full rounded-xl border border-line px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-violet/40'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(INITIAL_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getAllProductsAdminAPI({ limit: 100 })
        setProducts(res.data.products || [])
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const refetch = async () => {
    try {
      const res = await getAllProductsAdminAPI({ limit: 100 })
      setProducts(res.data.products || [])
    } catch (err) {
        console.error('Refetch failed:', err)
    }
  }

  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3500)
  }

  const openCreate = () => {
    setEditingProduct(null)
    setForm(INITIAL_FORM)
    setSubmitError(null)
    setShowForm(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name || '',
      category: product.category || 'furniture',
      subcategory: product.subcategory || '',
      description: product.description || '',
      monthlyRentalPrice: product.monthlyRentalPrice || '',
      securityDeposit: product.securityDeposit || '',
      city: product.city || '',
      isAvailableForRent: product.isAvailableForRent ?? true,
    })
    setSubmitError(null)
    setShowForm(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setSubmitError('Product name is required.')
      return
    }
    if (!form.monthlyRentalPrice || Number(form.monthlyRentalPrice) <= 0) {
      setSubmitError('Please enter a valid monthly rent.')
      return
    }
    if (!form.city.trim()) {
      setSubmitError('City is required.')
      return
    }

    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = {
        ...form,
        monthlyRentalPrice: Number(form.monthlyRentalPrice),
        securityDeposit: Number(form.securityDeposit) || 0,
      }
      if (editingProduct) {
        await updateProductAPI(editingProduct._id, payload)
        showSuccess('Product updated successfully.')
      } else {
        await createProductAPI(payload)
        showSuccess('Product created successfully.')
      }
      setShowForm(false)
      setEditingProduct(null)
      refetch()
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteProductAPI(id)
      setDeleteConfirm(null)
      showSuccess('Product deleted.')
      refetch()
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to delete product.')
    }
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={openCreate}
          className="rounded-xl bg-violet px-4 py-2.5 text-sm font-medium text-white hover:bg-violet/90 transition"
        >
          + Add product
        </button>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          ✓ {successMsg}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-line bg-white p-6">
          <h2 className="font-display text-base font-semibold text-ink mb-5">
            {editingProduct ? 'Edit product' : 'New product'}
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Name">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. 3-Seater Sofa"
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Category">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="furniture">Furniture</option>
                <option value="appliance">Appliance</option>
              </select>
            </Field>

            <Field label="Subcategory">
              <input
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                placeholder="e.g. sofa, fridge, bed"
                className={inputClass}
              />
            </Field>

            <Field label="Monthly rent (₹)">
              <input
                name="monthlyRentalPrice"
                type="number"
                min="0"
                value={form.monthlyRentalPrice}
                onChange={handleChange}
                placeholder="e.g. 1200"
                className={inputClass}
              />
            </Field>

            <Field label="Security deposit (₹)">
              <input
                name="securityDeposit"
                type="number"
                min="0"
                value={form.securityDeposit}
                onChange={handleChange}
                placeholder="e.g. 2400"
                className={inputClass}
              />
            </Field>

            <Field label="City">
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                className={inputClass}
              />
            </Field>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                name="isAvailableForRent"
                id="isAvailableForRent"
                checked={form.isAvailableForRent}
                onChange={handleChange}
                className="h-4 w-4 accent-violet"
              />
              <label htmlFor="isAvailableForRent" className="text-sm text-ink">
                Available for rent
              </label>
            </div>

            <div className="md:col-span-2">
              <Field label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Product description..."
                  className="w-full rounded-xl border border-line px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-violet/40 resize-none"
                />
              </Field>
            </div>
          </div>

          {submitError && (
            <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
              {submitError}
            </p>
          )}

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => { setShowForm(false); setSubmitError(null) }}
              className="flex-1 rounded-xl border border-line py-3 text-sm font-medium text-muted hover:text-ink transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 rounded-xl bg-violet py-3 text-sm font-medium text-white hover:bg-violet/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : editingProduct ? 'Update product' : 'Create product'}
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-line/40" />
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
      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No products yet
          </p>
          <p className="mt-2 text-sm text-muted">
            Add your first product to get started.
          </p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && products.length > 0 && (
        <div className="rounded-2xl border border-line bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper">
                <th className="px-5 py-3 text-left font-tag text-[10px] uppercase tracking-[0.15em] text-muted">
                  Name
                </th>
                <th className="px-5 py-3 text-left font-tag text-[10px] uppercase tracking-[0.15em] text-muted hidden md:table-cell">
                  Category
                </th>
                <th className="px-5 py-3 text-left font-tag text-[10px] uppercase tracking-[0.15em] text-muted hidden md:table-cell">
                  Price / mo
                </th>
                <th className="px-5 py-3 text-left font-tag text-[10px] uppercase tracking-[0.15em] text-muted hidden md:table-cell">
                  City
                </th>
                <th className="px-5 py-3 text-left font-tag text-[10px] uppercase tracking-[0.15em] text-muted">
                  Status
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-paper/50 transition">
                  <td className="px-5 py-4 font-medium text-ink">
                    {product.name}
                  </td>
                  <td className="px-5 py-4 text-muted hidden md:table-cell capitalize">
                    {product.category}
                  </td>
                  <td className="px-5 py-4 text-ink hidden md:table-cell">
                    ₹{product.monthlyRentalPrice?.toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-4 text-muted hidden md:table-cell">
                    {product.city}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.isAvailableForRent
                          ? 'bg-green-50 text-green-700'
                          : 'bg-line/40 text-muted'
                      }`}
                    >
                      {product.isAvailableForRent ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(product)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-violet/40 hover:text-violet transition"
                      >
                        Edit
                      </button>
                      {deleteConfirm === product._id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="rounded-lg bg-coral px-3 py-1.5 text-xs font-medium text-white hover:bg-coral/90 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted hover:text-ink transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(product._id)}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted hover:border-coral/40 hover:text-coral transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProducts