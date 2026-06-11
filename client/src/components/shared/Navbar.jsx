import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Navbar = () => {
    const { user, isAuthenticated, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        try {
            await handleLogout()
        } catch (error) {
            console.error(error)
        } finally {
            navigate('/login')
        }
    }

    return (
        <nav className="flex items-center justify-between px-6 py-4 shadow-md">
            <Link to="/" className="text-xl font-bold">
                RentEase
            </Link>

            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <>
                        <span>Welcome, {user?.name}</span>

                        <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-red-500 text-white rounded"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar