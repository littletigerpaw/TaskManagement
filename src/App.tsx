import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleGuard } from './components/RoleGuard'
import { TaskProvider } from './context/TaskContext'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { TaskCreatePage } from './pages/TaskCreatePage'
import { TaskDetailsPage } from './pages/TaskDetailsPage'
import { TaskEditPage } from './pages/TaskEditPage'
import { UnauthorizedPage } from './pages/UnauthorizedPage'

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/new"
              element={
                <ProtectedRoute>
                  <RoleGuard requiredRoles={['editor', 'manager', 'admin']}>
                    <TaskCreatePage />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <TaskDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id/edit"
              element={
                <ProtectedRoute>
                  <RoleGuard requiredRoles={['editor', 'manager', 'admin']}>
                    <TaskEditPage />
                  </RoleGuard>
                </ProtectedRoute>
              }
            />

            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </TaskProvider>
    </BrowserRouter>
  )
}

export default App
