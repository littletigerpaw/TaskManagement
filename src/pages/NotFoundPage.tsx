import { Link } from 'react-router-dom'

export const NotFoundPage = () => {
  return (
    <section className="panel auth-panel">
      <h1>Page Not Found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="primary-link">
        Return to Dashboard
      </Link>
    </section>
  )
}
