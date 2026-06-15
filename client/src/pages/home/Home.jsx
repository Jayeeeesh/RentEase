import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useProducts from '../../hooks/useProducts'
import ProductCard from '../../components/productCard/ProductCard'
import CategoryIcon from '../../components/UI/CategoryIcon'
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const { products, loading, fetchProducts } = useProducts()

  useEffect(() => {
    fetchProducts({ limit: 3 })
  }, [fetchProducts])

  const hasProducts = !loading && products.length > 0

  return (
    <div>
      {/* Hero */}
      <section className="hero mb-16 rounded-3xl bg-ink px-6 py-12 md:px-16 md:py-20">
        <div className="relative z-10 max-w-xl">
          <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet-soft">
            Furniture &amp; appliance rentals · Mumbai
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-paper md:text-6xl">
            Move cities.
            <br />
            Not furniture.
          </h1>
          <p className="mt-6 text-base text-white/70 md:text-lg">
            Beds, sofas, fridges and washing machines — delivered and set up
            before you arrive. Pay a simple monthly rent, then swap, extend
            or return whenever your plans change.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products?category=furniture"
              className="rounded-lg bg-violet px-5 py-3 text-sm font-medium text-white transition hover:bg-violet/90"
            >
              Browse furniture
            </Link>
            <Link
              to="/products?category=appliance"
              className="rounded-lg border border-white/20 px-5 py-3 text-sm font-medium text-paper transition hover:border-white/40 hover:bg-white/5"
            >
              Browse appliances
            </Link>
          </div>
          <p className="mt-6 font-tag text-xs tracking-wide text-white/40">
            No down payment · Cancel anytime · Free pickup on return
          </p>
        </div>

        {/* Floating rental tags — desktop only */}
        <div className="hero-tags--floating hidden md:block" aria-hidden="true">
          <span className="hero-tag hero-tag--violet">
            <span className="hero-tag__name">Sofa</span>
            <span className="hero-tag__price">
              ₹899<small>/mo</small>
            </span>
          </span>
          <span className="hero-tag hero-tag--coral">
            <span className="hero-tag__name">Fridge</span>
            <span className="hero-tag__price">
              ₹1,299<small>/mo</small>
            </span>
          </span>
          <span className="hero-tag hero-tag--paper">
            <span className="hero-tag__name">Study table</span>
            <span className="hero-tag__price">
              ₹399<small>/mo</small>
            </span>
          </span>
        </div>

        {/* Same tags as a scroll strip on mobile */}
        <div className="hero-tags--inline mt-8 flex gap-3 overflow-x-auto md:hidden" aria-hidden="true">
          <span className="hero-tag hero-tag--violet">
            <span className="hero-tag__name">Sofa</span>
            <span className="hero-tag__price">
              ₹899<small>/mo</small>
            </span>
          </span>
          <span className="hero-tag hero-tag--coral">
            <span className="hero-tag__name">Fridge</span>
            <span className="hero-tag__price">
              ₹1,299<small>/mo</small>
            </span>
          </span>
          <span className="hero-tag hero-tag--paper">
            <span className="hero-tag__name">Study table</span>
            <span className="hero-tag__price">
              ₹399<small>/mo</small>
            </span>
          </span>
          <span className="hero-tag hero-tag--violet">
            <span className="hero-tag__name">Washing machine</span>
            <span className="hero-tag__price">
              ₹999<small>/mo</small>
            </span>
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-16">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          How it works
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          Three steps. No store visits.
        </h2>

        <div className="mt-8 grid gap-10 md:grid-cols-3">
          <div>
            <span className="step-number">01</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">
              Pick what you need
            </h3>
            <p className="mt-2 text-sm text-muted">
              Browse furniture and appliances by category and city, and see
              what's ready to move in near you.
            </p>
          </div>
          <div>
            <span className="step-number">02</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">
              Pay monthly, not upfront
            </h3>
            <p className="mt-2 text-sm text-muted">
              One rent payment covers the item, delivery and setup — no
              lump-sum purchase, no resale hassle later.
            </p>
          </div>
          <div>
            <span className="step-number">03</span>
            <h3 className="mt-3 font-display text-lg font-semibold text-ink">
              Swap, extend or return
            </h3>
            <p className="mt-2 text-sm text-muted">
              Moving again, or settling in for longer? Update your tenure,
              swap for something else, or send it back.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Browse by category
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          Two ways to fill a room
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Link
            to="/products?category=furniture"
            className="group rounded-2xl border border-line bg-white p-8 transition hover:border-violet/40 hover:shadow-lg"
          >
            <CategoryIcon type="furniture" className="h-10 w-10 text-violet" />
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">
              Furniture
            </h3>
            <p className="mt-2 text-sm text-muted">
              Beds, sofas and study tables — delivered and assembled,
              move-in ready.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet transition-all group-hover:gap-2">
              Explore furniture <span aria-hidden="true">→</span>
            </span>
          </Link>

          <Link
            to="/products?category=appliance"
            className="group rounded-2xl border border-line bg-white p-8 transition hover:border-violet/40 hover:shadow-lg"
          >
            <CategoryIcon type="appliance" className="h-10 w-10 text-violet" />
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">
              Appliances
            </h3>
            <p className="mt-2 text-sm text-muted">
              Fridges, washing machines and TVs — installed, tested and
              ready to use on day one.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-violet transition-all group-hover:gap-2">
              Explore appliances <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="mb-16">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Available now
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          Recently listed
        </h2>

        {loading && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="aspect-4/3 animate-pulse rounded-2xl bg-line/40"
              />
            ))}
          </div>
        )}

        {hasProducts && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && !hasProducts && (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
            <p className="font-display text-lg font-semibold text-ink">
              New listings are on the way
            </p>
            <p className="mt-2 text-sm text-muted">
              Check back soon, or browse everything we have so far.
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block text-sm font-medium text-violet"
            >
              Browse all products →
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-violet px-6 py-12 text-center md:px-16 md:py-16">
        <h2 className="font-display text-2xl font-semibold text-white md:text-3xl">
          Set up your room, not your shopping cart.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/80">
          Create a free account to start browsing what's available near you.
        </p>
        {isAuthenticated ? (
          <Link
            to="/products"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-violet transition hover:bg-paper"
          >
            Browse all products
          </Link>
        ) : (
          <Link
            to="/register"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-violet transition hover:bg-paper"
          >
            Create free account
          </Link>
        )}
      </section>
    </div>
  )
}

export default Home