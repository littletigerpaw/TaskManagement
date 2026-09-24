import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TaskForm } from '../components/TaskForm'
import type { TaskFormValues } from '../types/task'

const initialValues: TaskFormValues = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: undefined,
}

describe('TaskForm', () => {
  it('shows validation messages when required fields are empty', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm initialValues={initialValues} submitLabel="Create Task" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '   ' } })
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }))

    expect(await screen.findByText('Title is required.')).toBeInTheDocument()
    expect(await screen.findByText('Description is required.')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('trims inputs and submits typed values', async () => {
    const onSubmit = vi.fn()
    render(<TaskForm initialValues={initialValues} submitLabel="Create Task" onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: '  Ship API  ' } })
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: '  Build endpoint integration  ' },
    })
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'done' } })
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'high' } })

    fireEvent.click(screen.getByRole('button', { name: 'Create Task' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Ship API',
      description: 'Build endpoint integration',
      status: 'done',
      priority: 'high',
      dueDate: undefined,
    })
  })
})
