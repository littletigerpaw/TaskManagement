import { Link } from 'react-router-dom'

export const UnauthorizedPage = () => {
  return (
    <section className="panel auth-panel">
      <h1>Unauthorized</h1>
      <p>
        You do not have permission to access this resource. Ask an administrator for
        editor, manager, or admin access.
      </p>
      <Link to="/login" className="primary-link">
        Go to Login
      </Link>
    </section>
  )
}
