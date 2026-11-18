import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import Loader from '../Loader/Loader'

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useCurrentUser()
  const location = useLocation()

  if (isLoading) {
    return <Loader text="Comprobando la sesión..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
