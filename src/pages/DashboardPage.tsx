import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { TaskCard } from '../components/TaskCard'
import { useTasks } from '../context/TaskContext'
import { useAuthorization } from '../hooks/useAuthorization'
import type { TaskPriority, TaskStatus } from '../types/task'

const statusOptions: Array<TaskStatus | 'all'> = ['all', 'todo', 'in-progress', 'done']
const priorityOptions: Array<TaskPriority | 'all'> = ['all', 'low', 'medium', 'high']

export const DashboardPage = () => {
  const { tasks, deleteTask, isLoading, operationError, isUsingRemoteApi } = useTasks()
  const { canManageTasks } = useAuthorization()
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [query, setQuery] = useState<string>('')

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatches = statusFilter === 'all' ? true : task.status === statusFilter
      const priorityMatches = priorityFilter === 'all' ? true : task.priority === priorityFilter
      const queryMatches = `${task.title} ${task.description}`
        .toLowerCase()
        .includes(query.toLowerCase())

      return statusMatches && priorityMatches && queryMatches
    })
  }, [tasks, statusFilter, priorityFilter, query])

  return (
    <section className="stack-lg">
      <div className="panel dashboard-header">
        <div>
          <h1>Task Dashboard</h1>
          <p>
            Track delivery with typed state, context, and secure authentication workflows.
          </p>
        </div>
        {canManageTasks ? (
          <Link to="/tasks/new" className="primary-link">
            Create Task
          </Link>
        ) : null}
      </div>

      {isUsingRemoteApi ? (
        <div className="panel status-banner">
          <p>Remote API mode enabled. Changes are synced to your configured task service.</p>
        </div>
      ) : null}

      {operationError ? (
        <div className="panel status-banner error-banner">
          <p>{operationError}</p>
        </div>
      ) : null}

      {isLoading ? (
        <div className="panel empty-state">
          <h2>Loading tasks...</h2>
        </div>
      ) : null}

      <div className="panel filters">
        <input
          placeholder="Search task title or description..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search tasks"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as TaskStatus | 'all')}
          aria-label="Filter by status"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              Status: {option}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | 'all')}
          aria-label="Filter by priority"
        >
          {priorityOptions.map((option) => (
            <option key={option} value={option}>
              Priority: {option}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="panel empty-state">
          <h2>No tasks found</h2>
          <p>Try adjusting filters or create a new task.</p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canManageTasks={canManageTasks}
              onDelete={deleteTask}
            />
          ))}
        </div>
      )}
    </section>
  )
}
