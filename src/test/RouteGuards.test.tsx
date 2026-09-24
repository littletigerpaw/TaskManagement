import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { RoleGuard } from '../components/RoleGuard'

const mockUseAuth0 = vi.fn()

vi.mock('../config/auth0', () => ({
  isAuthConfigured: true,
  auth0Environment: {
    domain: 'example.auth0.com',
    clientId: 'client-id',
    audience: undefined,
    rolesClaim: 'https://taskatlas.app/roles',
  },
}))

vi.mock('@auth0/auth0-react', async () => {
  const actual = await vi.importActual<typeof import('@auth0/auth0-react')>('@auth0/auth0-react')
  return {
    ...actual,
    useAuth0: () => mockUseAuth0(),
  }
})

beforeEach(() => {
  mockUseAuth0.mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  })
})

describe('Route guards', () => {
  it('redirects unauthenticated users to login in protected route', () => {
    render(
      <MemoryRouter initialEntries={['/private']}>
        <Routes>
          <Route path="/login" element={<p>Login Screen</p>} />
          <Route
            path="/private"
            element={
              <ProtectedRoute>
                <p>Private Content</p>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Login Screen')).toBeInTheDocument()
  })

  it('redirects unauthorized users to unauthorized page in role guard', () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { 'https://taskatlas.app/roles': ['viewer'] },
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/manage']}>
        <Routes>
          <Route path="/unauthorized" element={<p>Unauthorized</p>} />
          <Route
            path="/manage"
            element={
              <RoleGuard requiredRoles={['editor', 'manager', 'admin']}>
                <p>Manage Content</p>
              </RoleGuard>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Unauthorized')).toBeInTheDocument()
  })
})
