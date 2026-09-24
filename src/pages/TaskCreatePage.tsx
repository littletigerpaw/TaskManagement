import { useNavigate } from 'react-router-dom'
import { TaskForm } from '../components/TaskForm'
import { useTasks } from '../context/TaskContext'
import type { TaskFormValues } from '../types/task'

const defaultTaskValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: undefined,
}

export const TaskCreatePage = () => {
  const { createTask } = useTasks()
  const navigate = useNavigate()

  return (
    <TaskForm
      initialValues={defaultTaskValues}
      submitLabel="Create Task"
      onSubmit={async (values) => {
        const task = await createTask(values)
        navigate(`/tasks/${task.id}`)
      }}
    />
  )
}
