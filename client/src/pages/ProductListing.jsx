import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import ProductCard from '../components/productCard/ProductCard'

const CATEGORIES = [
  { label: 'All', value: null },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Appliances', value: 'appliance' },
]

const PAGE_TITLES = {
  furniture: 'Furniture for rent',
  appliance: 'Appliances for rent',
}

const ProductListing = () => {
  const { products, loading, error, fetchProducts } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')

  useEffect(() => {
    fetchProducts(category ? { category } : {})
  }, [fetchProducts, category])

  const handleCategoryChange = (value) => {
    if (value) {
      setSearchParams({ category: value })
    } else {
      setSearchParams({})
    }
  }

  const isEmpty =
    !loading && (error === 'No products found' || (!error && products.length === 0))
  const isError = !loading && error && error !== 'No products found'

  return (
    <div>
      <header className="mb-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Browse
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          {PAGE_TITLES[category] || 'All products'}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map(({ label, value }) => {
            const isActive = category === value || (!category && !value)
            return (
              <button
                key={label}
                type="button"
                onClick={() => handleCategoryChange(value)}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  isActive
                    ? 'border-violet bg-violet text-white'
                    : 'border-line bg-white text-muted hover:border-violet/40 hover:text-ink'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
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
            {category
              ? "We don't have any listings in this category right now."
              : 'New listings are on the way — check back soon.'}
          </p>
          {category && (
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductListing