const tasksApiBaseUrl = import.meta.env.VITE_TASKS_API_BASE_URL as string | undefined

export const apiEnvironment = {
  tasksApiBaseUrl: tasksApiBaseUrl?.trim() ?? '',
}

export const isTasksApiConfigured = Boolean(apiEnvironment.tasksApiBaseUrl)

export const buildTasksApiUrl = (path: string): string => {
  const base = apiEnvironment.tasksApiBaseUrl.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalizedPath}`
}
