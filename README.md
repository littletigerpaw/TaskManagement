# Task Atlas: TypeScript Task Management Application

Task Atlas is a React + TypeScript task management application built with Vite. It includes task dashboard workflows, task details, create/edit forms with typed validation, typed state management with React hooks and Context API, and Auth0 integration for authentication and authorization.

## Features

- Task dashboard with search and filtering by status and priority.
- Task creation, editing, and deletion flows.
- Task details page with task metadata and quick actions.
- Typed form validation and error handling.
- Global task state using React Context API + typed hooks.
- Auth0 login/register integration and protected routes.
- Role-based authorization for task management actions.
- Optional task API integration with resilient local fallback.
- Local persistence using `localStorage`.

## Tech Stack

- React 19
- TypeScript 6
- Vite 8
- React Router
- Auth0 React SDK

## Architecture

Project structure (main files):

- `src/types/task.ts`: task interfaces, union types, and validation error types.
- `src/context/TaskContext.tsx`: global task store, CRUD methods, typed hook.
- `src/services/taskApi.ts`: typed API client for remote CRUD sync.
- `src/hooks/useAuthorization.ts`: typed role extraction and access helpers.
- `src/components/TaskForm.tsx`: reusable form for create/edit with validation.
- `src/pages/`: route pages (`DashboardPage`, `TaskDetailsPage`, auth pages, etc.).
- `src/config/auth0.ts`: environment-based Auth0 configuration.
- `src/utils/taskValidation.ts`: typed validation logic.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Auth0

Copy `.env.example` to `.env` and add your Auth0 values:

```bash
cp .env.example .env
```

Required variables:

- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`

Optional:

- `VITE_AUTH0_AUDIENCE`
- `VITE_AUTH0_ROLES_CLAIM`
- `VITE_TASKS_API_BASE_URL`

If Auth0 values are missing, the app still runs in demo mode and shows a configuration warning.

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

### 6. Run tests

```bash
npm run test:run
```

## Auth0 Setup Notes

In your Auth0 application settings, set:

- Allowed Callback URLs: `http://localhost:5173`
- Allowed Logout URLs: `http://localhost:5173`
- Allowed Web Origins: `http://localhost:5173`

Adjust the host/port if your Vite server runs on a different port.

## Validation and Error Handling

- Task title is required and capped at 80 characters.
- Description is required and capped at 500 characters.
- Status and priority are validated against strict TypeScript unions.
- Due date is validated for valid date format.
- Form-level and field-level errors are shown in the UI.
- API failures gracefully degrade to local mode when possible and surface user-facing banners.

## Authorization Model

- Viewer role can browse dashboard and task details.
- Editor, manager, and admin roles can create, edit, and delete tasks.
- Role checks are done in route guards and in UI action controls.

## API Integration Contract

If `VITE_TASKS_API_BASE_URL` is provided, the app expects:

- `GET /tasks` returns `Task[]`
- `POST /tasks` accepts `TaskFormValues`, returns `Task`
- `PUT /tasks/:id` accepts `TaskFormValues`, returns `Task`
- `DELETE /tasks/:id` returns success status

On API unavailability, task operations continue using local state and localStorage fallback.

## TypeScript Requirements Coverage

- Typed task domain model with interfaces and literal unions.
- Typed React state with `useState` and typed form handlers.
- Typed Context API with a strict custom hook (`useTasks`).
- Typed Auth0 environment config and route-level auth handling.

## Suggested Git Workflow

1. Initialize repository:

```bash
git init
git add .
git commit -m "Initial Task Atlas scaffold"
```

2. Commit regularly by feature area:

- `feat: add typed task context and CRUD`
- `feat: add dashboard and task details routes`
- `feat: integrate Auth0 login and registration pages`
- `docs: expand README architecture and setup`
# TaskManagement
