import { Link, useNavigate, useParams } from 'react-router-dom'
import { TaskForm } from '../components/TaskForm'
import { useTasks } from '../context/TaskContext'
import { toDateInputValue } from '../utils/date'

export const TaskEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const { getTaskById, updateTask } = useTasks()
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
    <TaskForm
      initialValues={{
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: toDateInputValue(task.dueDate) || undefined,
      }}
      submitLabel="Update Task"
      onSubmit={async (values) => {
        await updateTask(task.id, values)
        navigate(`/tasks/${task.id}`)
      }}
    />
  )
}
