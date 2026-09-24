import { useAuth0 } from '@auth0/auth0-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { isAuthConfigured } from '../config/auth0'
import { useAuthorization } from '../hooks/useAuthorization'

export const Layout = () => {
  const { isAuthenticated, user, logout, loginWithRedirect } = useAuth0()
  const { canManageTasks } = useAuthorization()

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Task Atlas
        </Link>

        <nav className="main-nav" aria-label="Main">
          <NavLink to="/">Dashboard</NavLink>
          {canManageTasks ? <NavLink to="/tasks/new">New Task</NavLink> : null}
        </nav>

        <div className="auth-box">
          {isAuthConfigured ? (
            isAuthenticated ? (
              <>
                <span className="user-pill">{user?.name ?? user?.email ?? 'User'}</span>
                <button
                  type="button"
                  className="ghost"
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  void loginWithRedirect()
                }}
              >
                Log in
              </button>
            )
          ) : (
            <span className="warning-pill">Auth0 not configured (demo mode)</span>
          )}
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
