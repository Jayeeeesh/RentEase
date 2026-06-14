import { useEffect } from 'react'
import useProducts from '../hooks/useProducts'

const ProductListing = () => {
  const { products, loading, error, fetchProducts } = useProducts()

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No products available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold text-lg">{product.name}</h2>
          <p className="text-gray-500">₹{product.monthlyRentalPrice}/month</p>
          <p className="text-sm text-gray-400 mt-1">{product.category}</p>
        </div>
      ))}
    </div>
  )
}

export default ProductListing