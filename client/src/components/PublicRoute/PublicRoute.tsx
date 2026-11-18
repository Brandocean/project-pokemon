import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '../../contexts/CurrentUserContext'
import Loader from '../Loader/Loader'

function PublicRoute() {
  const { isAuthenticated, isLoading } = useCurrentUser()

  if (isLoading) {
    return <Loader text="Comprobando la sesión..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default PublicRoute
