import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthConfigured } from '../config/auth0'
import { useAuthorization, type UserRole } from '../hooks/useAuthorization'

interface RoleGuardProps {
  children: ReactNode
  requiredRoles: UserRole[]
}

export const RoleGuard = ({ children, requiredRoles }: RoleGuardProps) => {
  const { isAuthenticated, isLoading, hasAnyRole } = useAuthorization()

  if (!isAuthConfigured) {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <section className="panel centered">
        <h2>Checking permissions...</h2>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
