import { useAuth0 } from '@auth0/auth0-react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthConfigured } from '../config/auth0'
import type { ReactNode } from 'react'

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth0()
  const location = useLocation()

  if (!isAuthConfigured) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <section className="panel centered">
        <h2>Checking session...</h2>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
