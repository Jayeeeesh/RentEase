import { Navigate, useLocation } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, initializing } = useAuth()
    const location = useLocation()

    if (initializing) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <p className="text-sm text-muted">Checking authentication...</p>
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