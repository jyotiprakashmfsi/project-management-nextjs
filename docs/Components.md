# Components Documentation

This document provides detailed information about the components used in the application.

## Table of Contents

- [Overview](#overview)
- [Component Structure](#component-structure)
- [UI Components](#ui-components)
- [Authentication Components](#authentication-components)
- [Dashboard Components](#dashboard-components)
- [Project Components](#project-components)
- [Task Components](#task-components)
- [Error Handling Components](#error-handling-components)
- [Protected Route Components](#protected-route-components)
- [Best Practices](#best-practices)

## Overview

The application uses a component-based architecture with React and Next.js. Components are organized by feature and functionality, promoting reusability and maintainability. All components are written in TypeScript, providing type safety and better developer experience.

## Component Structure

The components are organized in the following structure:

```
components/
├── auth/                    # Authentication components
│   ├── signin/              # Sign-in form components
│   └── signup/              # Sign-up form components
├── dashboard/               # Dashboard components
├── error/                   # Error handling components
├── examples/                # Example components for reference
├── home/                    # Home page components
├── project/                 # Project-related components
├── protected/               # Protected route components
├── settings/                # User settings components
├── tasks/                   # Task-related components
├── teams/                   # Team management components
├── theme/                   # Theme-related components
└── ui/                      # Reusable UI components
```

## UI Components

The `ui` directory contains reusable UI components that are used throughout the application.

### Button Component

The Button component provides a consistent button style across the application.

**File:** `/components/ui/button.tsx`

**Props:**
- `children`: React nodes to be rendered inside the button
- `className`: Additional CSS classes to apply to the button
- All standard HTML button attributes

**Example:**
```tsx
import { Button } from '@/components/ui/button';

function MyComponent() {
  return (
    <Button 
      onClick={() => console.log('Button clicked')} 
      className="mt-4"
      disabled={isLoading}
    >
      Submit
    </Button>
  );
}
```

### Error Message Component

The Error Message component displays error messages in a consistent format.

**File:** `/components/ui/error-message.tsx`

**Props:**
- `message`: The error message to display
- `className`: Additional CSS classes to apply to the error message

**Example:**
```tsx
import { ErrorMessage } from '@/components/ui/error-message';

function MyForm() {
  return (
    <form>
      <input type="text" name="username" />
      {errors.username && <ErrorMessage message={errors.username} />}
    </form>
  );
}
```

### Sidebar Component

The Sidebar component provides navigation for the application.

**File:** `/components/ui/sidebar.tsx`

**Props:**
- `isOpen`: Whether the sidebar is open
- `onClose`: Function to call when the sidebar is closed
- `user`: The current user object

**Example:**
```tsx
import { Sidebar } from '@/components/ui/sidebar';

function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Sidebar</button>
      <Sidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        user={currentUser} 
      />
    </div>
  );
}
```

## Authentication Components

The `auth` directory contains components related to user authentication.

### Sign In Component

The Sign In component provides a form for user login.

**File:** `/components/auth/signin/index.tsx`

**Features:**
- Email and password input fields with validation
- Password visibility toggle
- Form submission with loading state
- Error handling and display
- Navigation to sign up page

**Example:**
```tsx
import LoginComponent from '@/components/auth/signin';

function LoginPage() {
  return (
    <div>
      <h1>Login to Your Account</h1>
      <LoginComponent />
    </div>
  );
}
```

### Sign Up Component

The Sign Up component provides a form for user registration.

**File:** `/components/auth/signup/index.tsx`

**Features:**
- Input fields for name, email, and password with validation
- Password visibility toggle
- Form submission with loading state
- Error handling and display
- Navigation to sign in page

**Example:**
```tsx
import SignupComponent from '@/components/auth/signup';

function SignupPage() {
  return (
    <div>
      <h1>Create Your Account</h1>
      <SignupComponent />
    </div>
  );
}
```

## Dashboard Components

The `dashboard` directory contains components related to the user dashboard.

### Dashboard Component

The Dashboard component displays an overview of the user's projects and tasks.

**File:** `/components/dashboard/index.tsx`

**Features:**
- Statistics overview (total projects, completed tasks, in-progress tasks, pending tasks)
- Recent projects list with status indicators
- Recent tasks list with priority indicators
- Loading state handling
- Error handling with toast notifications

**Example:**
```tsx
import DashboardComponent from '@/components/dashboard';

function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <DashboardComponent />
    </div>
  );
}
```

## Project Components

The `project` directory contains components related to project management.

### New Project Component

The New Project component provides a form for creating a new project.

**File:** `/components/project/new-project.tsx`

**Features:**
- Input fields for project name, description, and status
- Form validation
- Form submission with loading state
- Error handling and display

**Example:**
```tsx
import NewProjectComponent from '@/components/project/new-project';

function NewProjectPage() {
  return (
    <div>
      <h1>Create New Project</h1>
      <NewProjectComponent />
    </div>
  );
}
```

### Project Component

The Project component displays project details and allows for project management.

**File:** `/components/project/project-component.tsx`

**Features:**
- Project details display
- Project status management
- Team member management
- Project deletion
- Error handling

**Example:**
```tsx
import ProjectComponent from '@/components/project/project-component';

function ProjectPage({ projectId }) {
  return (
    <div>
      <h1>Project Details</h1>
      <ProjectComponent projectId={projectId} />
    </div>
  );
}
```

### Project Tasks Component

The Project Tasks component displays and manages tasks for a specific project.

**File:** `/components/project/project-tasks.tsx`

**Features:**
- Task list with filtering and sorting
- Task creation, editing, and deletion
- Task status management
- Error handling

**Example:**
```tsx
import ProjectTasksComponent from '@/components/project/project-tasks';

function ProjectTasksPage({ projectId }) {
  return (
    <div>
      <h1>Project Tasks</h1>
      <ProjectTasksComponent projectId={projectId} />
    </div>
  );
}
```

## Task Components

The `tasks` directory contains components related to task management.

### Task Details Component

The Task Details component displays detailed information about a task.

**File:** `/components/tasks/task-details.tsx`

**Features:**
- Task details display
- Task status management
- Task assignment
- Comments and attachments
- Error handling

**Example:**
```tsx
import TaskDetailsComponent from '@/components/tasks/task-details';

function TaskDetailsPage({ taskId }) {
  return (
    <div>
      <h1>Task Details</h1>
      <TaskDetailsComponent taskId={taskId} />
    </div>
  );
}
```

### Task Modal Component

The Task Modal component provides a modal for creating or editing a task.

**File:** `/components/tasks/task-modal.tsx`

**Features:**
- Input fields for task title, description, status, priority, and due date
- Form validation
- Form submission with loading state
- Error handling and display

**Example:**
```tsx
import TaskModalComponent from '@/components/tasks/task-modal';

function ProjectPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Create Task</button>
      {isModalOpen && (
        <TaskModalComponent 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          projectId={projectId} 
        />
      )}
    </div>
  );
}
```

### Tasks Component

The Tasks component displays a list of tasks with filtering and sorting options.

**File:** `/components/tasks/tasks-component.tsx`

**Features:**
- Task list with filtering by status, priority, and assignee
- Sorting by due date, priority, and status
- Task creation, editing, and deletion
- Error handling

**Example:**
```tsx
import TasksComponent from '@/components/tasks/tasks-component';

function TasksPage() {
  return (
    <div>
      <h1>Tasks</h1>
      <TasksComponent />
    </div>
  );
}
```

## Error Handling Components

The `error` directory contains components related to error handling.

### Error Boundary Component

The Error Boundary component catches JavaScript errors in child components and displays a fallback UI.

**File:** `/components/error/ErrorBoundary.tsx`

**Features:**
- Catches JavaScript errors in child components
- Displays a fallback UI when an error occurs
- Provides a way to reset the error state
- Logs errors to the console

**Props:**
- `children`: React nodes to be rendered inside the error boundary
- `fallback`: Optional custom fallback UI or render prop function

**Example:**
```tsx
import ErrorBoundary from '@/components/error/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Error Fallback Component

The Error Fallback component displays a user-friendly error message when an error occurs.

**File:** `/components/error/ErrorFallback.tsx`

**Props:**
- `error`: The error object
- `resetErrorBoundary`: Function to reset the error boundary

**Example:**
```tsx
import ErrorBoundary from '@/components/error/ErrorBoundary';
import ErrorFallback from '@/components/error/ErrorFallback';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Error Handler Component

The Error Handler component provides a context for handling errors throughout the application.

**File:** `/components/error/ErrorHandler.tsx`

**Features:**
- Provides a context for error handling
- Displays toast notifications for errors
- Logs errors to the console

**Example:**
```tsx
import { ErrorHandler } from '@/components/error/ErrorHandler';

function App() {
  return (
    <ErrorHandler>
      <MyComponent />
    </ErrorHandler>
  );
}
```

### withErrorBoundary HOC

The withErrorBoundary higher-order component wraps a component with an ErrorBoundary.

**File:** `/components/error/withErrorBoundary.tsx`

**Features:**
- Wraps a component with an ErrorBoundary
- Provides a consistent way to add error boundaries to components

**Example:**
```tsx
import { withErrorBoundary } from '@/components/error/withErrorBoundary';

function MyComponent() {
  // Component code
}

export default withErrorBoundary(MyComponent);
```

## Protected Route Components

The `protected` directory contains components related to route protection.

### Protected Route Component

The Protected Route component ensures that only authenticated users can access certain routes.

**File:** `/components/protected/protected-route.tsx`

**Features:**
- Checks if the user is authenticated
- Redirects to the login page if the user is not authenticated
- Displays a loading state while checking authentication
- Supports role-based access control

**Example:**
```tsx
import ProtectedRoute from '@/components/protected/protected-route';

function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardComponent />
    </ProtectedRoute>
  );
}
```

## Best Practices

When working with components in this application, follow these best practices:

1. **Component Organization**: Keep components organized by feature and functionality.

2. **Component Naming**: Use descriptive names for components that reflect their purpose.

3. **Component Size**: Keep components small and focused on a single responsibility.

4. **Props**: Define prop types using TypeScript interfaces for better type safety.

5. **State Management**: Use React hooks for state management within components.

6. **Error Handling**: Use error boundaries to catch and handle errors gracefully.

7. **Accessibility**: Ensure components are accessible by using semantic HTML and ARIA attributes.

8. **Testing**: Write tests for components to ensure they work as expected.

9. **Documentation**: Document components with JSDoc comments for better code understanding.

10. **Reusability**: Create reusable components that can be used in multiple places.

11. **Performance**: Optimize components for performance by using React.memo, useMemo, and useCallback where appropriate.

12. **Styling**: Use Tailwind CSS for styling components, following the project's design system.
