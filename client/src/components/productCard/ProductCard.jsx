import { Link } from 'react-router-dom'
import CategoryIcon from '../UI/CategoryIcon'
import "./ProductCard.css"

const ProductCard = ({ product }) => {
  const {
    _id,
    name,
    images,
    monthlyRentalPrice,
    securityDeposit,
    minTenureMonths,
    city,
    category,
    subcategory,
    isAvailableForRent,
  } = product

  const image = images?.[0]

  return (
    <Link
      to={`/products/${_id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative flex aspect-4/3 items-center justify-center overflow-hidden bg-paper">
        {image?.url ? (
          <img
            src={image.url}
            alt={image.alt || name}
            className="h-full w-full object-cover"
          />
        ) : (
          <CategoryIcon
            type={subcategory || category}
            className="h-12 w-12 text-violet/30"
          />
        )}

        {!isAvailableForRent && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-tag text-[0.65rem] uppercase tracking-wide text-paper">
            Currently rented
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="font-tag text-[0.65rem] uppercase tracking-[0.15em] text-muted">
            {(subcategory || category)?.replace('_', ' ')}
          </p>
          <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-violet">
            {name}
          </h3>
          <p className="text-sm text-muted">{city}</p>
        </div>

        <div className="mt-auto">
          <span className="rental-tag">
            <span className="rental-tag__price">
              ₹{monthlyRentalPrice}
              <small>/mo</small>
            </span>
            <span className="rental-tag__meta">
              min {minTenureMonths} mo · ₹{securityDeposit} deposit
            </span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard