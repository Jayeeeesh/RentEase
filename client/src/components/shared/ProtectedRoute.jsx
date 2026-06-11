import { Navigate, useLocation } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth()
    const location = useLocation()

    // 1. Loading state (auth check running)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Checking authentication...</p>
            </div>
        )
    }

    // 2. Not logged in → redirect
    if (!user || !isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }} // redirect back after login
            />
        )
    }

    // 3. Logged in → allow access
    return children
}

export default ProtectedRoute