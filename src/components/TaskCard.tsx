import { Link } from 'react-router-dom'
import type { Task } from '../types/task'
import { formatDate } from '../utils/date'

interface TaskCardProps {
  task: Task
  canManageTasks: boolean
  onDelete: (taskId: string) => Promise<void>
}

export const TaskCard = ({ task, canManageTasks, onDelete }: TaskCardProps) => {
  return (
    <article className="task-card">
      <header>
        <h3>{task.title}</h3>
        <span className={`tag priority-${task.priority}`}>{task.priority}</span>
      </header>
      <p>{task.description}</p>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>{task.status}</dd>
        </div>
        <div>
          <dt>Due</dt>
          <dd>{formatDate(task.dueDate)}</dd>
        </div>
      </dl>
      <div className="card-actions">
        <Link to={`/tasks/${task.id}`} className="ghost-link">
          Details
        </Link>
        {canManageTasks ? (
          <>
            <Link to={`/tasks/${task.id}/edit`} className="ghost-link">
              Edit
            </Link>
            <button
              type="button"
              className="danger"
              onClick={() => {
                void onDelete(task.id)
              }}
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </article>
  )
}
