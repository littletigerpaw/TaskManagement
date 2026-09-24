import { useState } from 'react'
import { TASK_PRIORITY, TASK_STATUS, type TaskFormValues, type TaskValidationErrors } from '../types/task'
import { validateTaskForm } from '../utils/taskValidation'

interface TaskFormProps {
  initialValues: TaskFormValues
  submitLabel: string
  onSubmit: (values: TaskFormValues) => Promise<void> | void
}

export const TaskForm = ({ initialValues, submitLabel, onSubmit }: TaskFormProps) => {
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [errors, setErrors] = useState<TaskValidationErrors>({})
  const [formError, setFormError] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleChange = <K extends keyof TaskFormValues>(
    field: K,
    value: TaskFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    const validationErrors = validateTaskForm(values)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
      })
    } catch {
      setFormError('Unable to save this task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="task-form panel" onSubmit={handleSubmit} noValidate>
      <h2>{submitLabel}</h2>

      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        value={values.title}
        onChange={(event) => handleChange('title', event.target.value)}
        aria-invalid={Boolean(errors.title)}
      />
      {errors.title ? <p className="field-error">{errors.title}</p> : null}

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        value={values.description}
        onChange={(event) => handleChange('description', event.target.value)}
        rows={5}
        aria-invalid={Boolean(errors.description)}
      />
      {errors.description ? <p className="field-error">{errors.description}</p> : null}

      <div className="inline-grid">
        <div>
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={values.status}
            onChange={(event) => handleChange('status', event.target.value as TaskFormValues['status'])}
          >
            {TASK_STATUS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </select>
          {errors.status ? <p className="field-error">{errors.status}</p> : null}
        </div>

        <div>
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={values.priority}
            onChange={(event) => handleChange('priority', event.target.value as TaskFormValues['priority'])}
          >
            {TASK_PRIORITY.map((priorityOption) => (
              <option key={priorityOption} value={priorityOption}>
                {priorityOption}
              </option>
            ))}
          </select>
          {errors.priority ? <p className="field-error">{errors.priority}</p> : null}
        </div>
      </div>

      <label htmlFor="task-dueDate">Due date</label>
      <input
        id="task-dueDate"
        type="date"
        value={values.dueDate ?? ''}
        onChange={(event) => handleChange('dueDate', event.target.value || undefined)}
      />
      {errors.dueDate ? <p className="field-error">{errors.dueDate}</p> : null}

      {formError ? <p className="field-error">{formError}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {submitLabel}
      </button>
    </form>
  )
}
