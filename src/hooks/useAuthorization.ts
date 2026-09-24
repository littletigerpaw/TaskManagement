import { useAuth0 } from '@auth0/auth0-react'
import { auth0Environment, isAuthConfigured } from '../config/auth0'

export type UserRole = 'viewer' | 'editor' | 'manager' | 'admin'

interface AuthLikeUser {
  [key: string]: unknown
}

const normalizeRoles = (roles: unknown): UserRole[] => {
  if (!Array.isArray(roles)) return []

  return roles
    .filter((value): value is string => typeof value === 'string')
    .filter((value): value is UserRole =>
      ['viewer', 'editor', 'manager', 'admin'].includes(value),
    )
}

export const extractUserRoles = (user: AuthLikeUser | undefined): UserRole[] => {
  if (!user) return []

  const namespacedRoles = normalizeRoles(user[auth0Environment.rolesClaim])
  if (namespacedRoles.length > 0) {
    return namespacedRoles
  }

  const appMetadata = user.app_metadata as { roles?: unknown } | undefined
  const metadataRoles = normalizeRoles(appMetadata?.roles)
  if (metadataRoles.length > 0) {
    return metadataRoles
  }

  return ['viewer']
}

export const useAuthorization = () => {
  const { user, isAuthenticated, isLoading } = useAuth0()
  const roles = extractUserRoles(user as AuthLikeUser | undefined)

  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    if (!isAuthConfigured) return true
    if (!isAuthenticated) return false
    return requiredRoles.some((role) => roles.includes(role))
  }

  const canManageTasks = hasAnyRole(['editor', 'manager', 'admin'])

  return {
    roles,
    isAuthenticated,
    isLoading,
    hasAnyRole,
    canManageTasks,
  }
}
