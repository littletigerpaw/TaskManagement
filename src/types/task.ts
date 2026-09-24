export const TASK_STATUS = ['todo', 'in-progress', 'done'] as const
export const TASK_PRIORITY = ['low', 'medium', 'high'] as const

export type TaskStatus = (typeof TASK_STATUS)[number]
export type TaskPriority = (typeof TASK_PRIORITY)[number]

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
  createdAt: string
  updatedAt: string
  ownerId?: string
}

export interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate?: string
}

export type TaskValidationErrors = Partial<Record<keyof TaskFormValues, string>>
