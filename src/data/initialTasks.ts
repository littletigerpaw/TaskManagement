import type { Task } from '../types/task'

const now = new Date().toISOString()

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Plan sprint backlog',
    description: 'Review incoming product requests and estimate engineering effort.',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-2',
    title: 'Ship task detail page',
    description: 'Complete read/edit experience for a single task and verify routing.',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: now,
    updatedAt: now,
  },
]
