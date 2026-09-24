import { buildTasksApiUrl, isTasksApiConfigured } from '../config/api'
import type { Task, TaskFormValues } from '../types/task'

interface TaskResponseShape {
  id: string
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
  dueDate?: string
  createdAt: string
  updatedAt: string
  ownerId?: string
}

const safeParseTask = (value: unknown): Task | null => {
  if (typeof value !== 'object' || value === null) return null
  const candidate = value as Partial<TaskResponseShape>

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.title !== 'string' ||
    typeof candidate.description !== 'string' ||
    typeof candidate.status !== 'string' ||
    typeof candidate.priority !== 'string' ||
    typeof candidate.createdAt !== 'string' ||
    typeof candidate.updatedAt !== 'string'
  ) {
    return null
  }

  if (!['todo', 'in-progress', 'done'].includes(candidate.status)) {
    return null
  }

  if (!['low', 'medium', 'high'].includes(candidate.priority)) {
    return null
  }

  return {
    id: candidate.id,
    title: candidate.title,
    description: candidate.description,
    status: candidate.status,
    priority: candidate.priority,
    dueDate: candidate.dueDate,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    ownerId: candidate.ownerId,
  }
}

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  if (!isTasksApiConfigured) {
    throw new Error('Tasks API is not configured.')
  }

  const response = await fetch(buildTasksApiUrl(path), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Task API request failed with status ${response.status}.`)
  }

  return (await response.json()) as T
}

export const taskApi = {
  isConfigured: isTasksApiConfigured,
  async listTasks(): Promise<Task[]> {
    const payload = await request<unknown[]>('/tasks')
    if (!Array.isArray(payload)) {
      throw new Error('Invalid tasks response shape.')
    }

    return payload
      .map((item) => safeParseTask(item))
      .filter((task): task is Task => task !== null)
  },

  async createTask(values: TaskFormValues): Promise<Task> {
    const payload = await request<unknown>('/tasks', {
      method: 'POST',
      body: JSON.stringify(values),
    })

    const task = safeParseTask(payload)
    if (!task) {
      throw new Error('Invalid task payload returned after create.')
    }

    return task
  },

  async updateTask(taskId: string, values: TaskFormValues): Promise<Task> {
    const payload = await request<unknown>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(values),
    })

    const task = safeParseTask(payload)
    if (!task) {
      throw new Error('Invalid task payload returned after update.')
    }

    return task
  },

  async deleteTask(taskId: string): Promise<void> {
    await request(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
  },
}
