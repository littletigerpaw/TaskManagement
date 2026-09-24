import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TaskProvider, useTasks } from '../context/TaskContext'

const TaskHarness = () => {
  const { tasks, createTask } = useTasks()

  return (
    <div>
      <p data-testid="count">{tasks.length}</p>
      <button
        type="button"
        onClick={() => {
          void createTask({
            title: 'New typed task',
            description: 'Created from context test',
            status: 'todo',
            priority: 'low',
            dueDate: undefined,
          })
        }}
      >
        Add Task
      </button>
    </div>
  )
}

describe('TaskContext', () => {
  it('adds a task through typed createTask action', async () => {
    const user = userEvent.setup()

    render(
      <TaskProvider>
        <TaskHarness />
      </TaskProvider>,
    )

    const before = Number(screen.getByTestId('count').textContent)
    await user.click(screen.getByRole('button', { name: 'Add Task' }))
    const after = Number(screen.getByTestId('count').textContent)

    expect(after).toBe(before + 1)
  })
})
