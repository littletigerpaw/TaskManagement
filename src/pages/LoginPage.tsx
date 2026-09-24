import { useAuth0 } from '@auth0/auth0-react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { isAuthConfigured } from '../config/auth0'

interface LocationState {
  from?: string
}

export const LoginPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const location = useLocation()
  const state = location.state as LocationState | null

  if (isAuthenticated) {
    return <Navigate to={state?.from ?? '/'} replace />
  }

  return (
    <section className="panel auth-panel">
      <h1>Login</h1>
      <p>Access your task workspace with Auth0 secure authentication.</p>

      {isAuthConfigured ? (
        <button
          type="button"
          onClick={() => {
            void loginWithRedirect({ appState: { returnTo: state?.from ?? '/' } })
          }}
        >
          Continue with Auth0
        </button>
      ) : (
        <p className="field-error">
          Add Auth0 credentials in environment variables to enable authentication.
        </p>
      )}

      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}
