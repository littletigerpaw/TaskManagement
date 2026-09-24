import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTasks } from '../context/TaskContext'
import { useAuthorization } from '../hooks/useAuthorization'
import { formatDate } from '../utils/date'

export const TaskDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const { getTaskById, deleteTask, operationError } = useTasks()
  const { canManageTasks } = useAuthorization()
  const navigate = useNavigate()

  if (!id) {
    return (
      <section className="panel">
        <h2>Missing task id</h2>
      </section>
    )
  }

  const task = getTaskById(id)

  if (!task) {
    return (
      <section className="panel">
        <h2>Task not found</h2>
        <Link to="/" className="ghost-link">
          Back to dashboard
        </Link>
      </section>
    )
  }

  return (
    <section className="panel stack-md">
      <div className="details-head">
        <div>
          <h1>{task.title}</h1>
          <p>{task.description}</p>
        </div>
        <span className={`tag priority-${task.priority}`}>{task.priority}</span>
      </div>

      <dl className="details-grid">
        <div>
          <dt>Status</dt>
          <dd>{task.status}</dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd>{formatDate(task.dueDate)}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{formatDate(task.createdAt)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(task.updatedAt)}</dd>
        </div>
      </dl>

      {operationError ? <p className="field-error">{operationError}</p> : null}

      <div className="card-actions">
        {canManageTasks ? (
          <>
            <Link to={`/tasks/${task.id}/edit`} className="primary-link">
              Edit Task
            </Link>
            <button
              type="button"
              className="danger"
              onClick={async () => {
                try {
                  await deleteTask(task.id)
                  navigate('/')
                } catch {
                  // Error feedback is shown through operationError from context.
                }
              }}
            >
              Delete Task
            </button>
          </>
        ) : null}
      </div>
    </section>
  )
}
