import { TASK_PRIORITY, TASK_STATUS, type TaskFormValues, type TaskValidationErrors } from '../types/task'

export const validateTaskForm = (values: TaskFormValues): TaskValidationErrors => {
  const errors: TaskValidationErrors = {}

  if (!values.title.trim()) {
    errors.title = 'Title is required.'
  } else if (values.title.trim().length > 80) {
    errors.title = 'Title cannot be longer than 80 characters.'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.'
  } else if (values.description.trim().length > 500) {
    errors.description = 'Description cannot be longer than 500 characters.'
  }

  if (!TASK_STATUS.includes(values.status)) {
    errors.status = 'Please choose a valid status.'
  }

  if (!TASK_PRIORITY.includes(values.priority)) {
    errors.priority = 'Please choose a valid priority.'
  }

  if (values.dueDate) {
    const parsed = new Date(values.dueDate)
    if (Number.isNaN(parsed.getTime())) {
      errors.dueDate = 'Please provide a valid due date.'
    }
  }

  return errors
}
