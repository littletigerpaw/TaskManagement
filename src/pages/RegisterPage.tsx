import { useAuth0 } from '@auth0/auth0-react'
import { Link, Navigate } from 'react-router-dom'
import { isAuthConfigured } from '../config/auth0'

export const RegisterPage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0()

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="panel auth-panel">
      <h1>Register</h1>
      <p>Create your account to start managing projects and delivery tasks.</p>

      {isAuthConfigured ? (
        <button
          type="button"
          onClick={() => {
            void loginWithRedirect({
              authorizationParams: { screen_hint: 'signup' },
            })
          }}
        >
          Sign up with Auth0
        </button>
      ) : (
        <p className="field-error">
          Add Auth0 credentials in environment variables to enable registration.
        </p>
      )}

      <p>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
