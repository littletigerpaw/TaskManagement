/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialTasks } from '../data/initialTasks'
import { taskApi } from '../services/taskApi'
import type { Task, TaskFormValues } from '../types/task'

interface TaskContextValue {
  tasks: Task[]
  selectedTaskId: string | null
  setSelectedTaskId: (taskId: string | null) => void
  getTaskById: (taskId: string) => Task | undefined
  createTask: (values: TaskFormValues) => Promise<Task>
  updateTask: (taskId: string, values: TaskFormValues) => Promise<Task>
  deleteTask: (taskId: string) => Promise<void>
  isLoading: boolean
  operationError: string | null
  isUsingRemoteApi: boolean
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined)
const TASK_STORAGE_KEY = 'task-management.tasks'

const loadTasks = (): Task[] => {
  const persisted = localStorage.getItem(TASK_STORAGE_KEY)
  if (!persisted) return initialTasks

  try {
    const parsed = JSON.parse(persisted) as Task[]
    if (!Array.isArray(parsed)) {
      return initialTasks
    }
    return parsed
  } catch {
    return initialTasks
  }
}

const createTaskId = (): string => {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `task-${Date.now()}`
}

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(taskApi.isConfigured)
  const [operationError, setOperationError] = useState<string | null>(null)

  const getTaskById = useMemo(
    () => (taskId: string): Task | undefined => tasks.find((task) => task.id === taskId),
    [tasks],
  )

  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    const hydrateFromApi = async () => {
      if (!taskApi.isConfigured) {
        setIsLoading(false)
        return
      }

      try {
        const remoteTasks = await taskApi.listTasks()
        if (remoteTasks.length > 0) {
          setTasks(remoteTasks)
        }
      } catch {
        setOperationError(
          'Connected API could not be reached. Working with local offline task storage.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void hydrateFromApi()
  }, [])

  const createTask = async (values: TaskFormValues): Promise<Task> => {
    setOperationError(null)

    const timestamp = new Date().toISOString()
    const optimisticTask: Task = {
      id: createTaskId(),
      ...values,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    setTasks((current) => [optimisticTask, ...current])

    if (!taskApi.isConfigured) {
      return optimisticTask
    }

    try {
      const remoteTask = await taskApi.createTask(values)
      setTasks((current) =>
        current.map((task) => (task.id === optimisticTask.id ? remoteTask : task)),
      )
      return remoteTask
    } catch {
      setOperationError('Task saved locally. API sync failed during create.')
      return optimisticTask
    }
  }

  const updateTask = async (taskId: string, values: TaskFormValues): Promise<Task> => {
    setOperationError(null)
    const existingTask = getTaskById(taskId)

    if (!existingTask) {
      throw new Error('Task not found.')
    }

    const optimisticTask: Task = {
      ...existingTask,
      ...values,
      updatedAt: new Date().toISOString(),
    }

    setTasks((current) =>
      current.map((task) => (task.id === taskId ? optimisticTask : task)),
    )

    if (!taskApi.isConfigured) {
      return optimisticTask
    }

    try {
      const remoteTask = await taskApi.updateTask(taskId, values)
      setTasks((current) =>
        current.map((task) => (task.id === taskId ? remoteTask : task)),
      )
      return remoteTask
    } catch {
      setOperationError('Task updated locally. API sync failed during update.')
      return optimisticTask
    }
  }

  const deleteTask = async (taskId: string): Promise<void> => {
    setOperationError(null)
    const snapshot = tasks

    setTasks((current) => current.filter((task) => task.id !== taskId))
    setSelectedTaskId((currentSelected) =>
      currentSelected === taskId ? null : currentSelected,
    )

    if (!taskApi.isConfigured) {
      return
    }

    try {
      await taskApi.deleteTask(taskId)
    } catch {
      setTasks(snapshot)
      setOperationError('Delete failed to sync with API. Local changes were reverted.')
      throw new Error('Delete failed.')
    }
  }

  const value: TaskContextValue = {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    isLoading,
    operationError,
    isUsingRemoteApi: taskApi.isConfigured,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTasks = (): TaskContextValue => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider.')
  }
  return context
}
