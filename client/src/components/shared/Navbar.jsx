import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Navbar = () => {
    const { user, isAuthenticated } = useAuth()

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-line bg-white">
            <Link to="/" className="font-display text-lg font-semibold text-ink tracking-tight">
                RentEase
            </Link>

            <div className="flex items-center gap-5">
                {isAuthenticated ? (
                    <>
                        <Link to="/products" className="text-sm text-muted hover:text-ink transition">
                            Products
                        </Link>
                        <Link to="/my-rentals" className="text-sm text-muted hover:text-ink transition">
                            My Rentals
                        </Link>
                        <Link to="/my-orders" className="text-sm text-muted hover:text-ink transition">
                            My Orders
                        </Link>
                        <Link to="/profile" className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink hover:border-violet/50 hover:text-violet transition">
                            {user?.name?.split(' ')[0] || 'Profile'}
                        </Link>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm text-muted hover:text-ink transition">
                            Login
                        </Link>
                        <Link to="/register" className="rounded-lg bg-violet px-4 py-2 text-sm font-medium text-white hover:bg-violet/90 transition">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar