import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import TaskModal from '../../components/tasks/task-modal';
import { projectUserApi } from '@/services/client-services/project-users/api';
import { taskApi } from '@/services/client-services/tasks/api';
import toast from 'react-hot-toast';
// import { act } from 'react-dom/test-utils';

jest.mock('@/services/client-services/project-users/api', () => ({
  projectUserApi: {
    getProjectUsers: jest.fn(),
  }
}));

jest.mock('@/services/client-services/tasks/api', () => ({
  taskApi: {
    createTask: jest.fn(),
    updateTask: jest.fn(),
  }
}));

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('TaskModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();
  const projectId = 1;
  
  const mockUsers = [
    { id: 1, fname: 'John Doe', user_id: 101 },
    { id: 2, fname: 'Jane Smith', user_id: 102 },
  ];
  
  const mockTask = {
    id: 1,
    project_id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'started',
    end_time: '2025-03-15T00:00:00.000Z',
    assigned_to: 101,
    priority: 'high',
    task_json: { messages: [] },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the API response for getProjectUsers
    projectUserApi.getProjectUsers.mockResolvedValue({
      users: mockUsers,
    });
  });

  it('renders the create task modal correctly', async () => {
    await React.act(async () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          projectId={projectId}
          onSuccess={mockOnSuccess}
        />
      );
    });

    // Check if the modal title is correct
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assign to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
    
    // Wait for users to be loaded
    await waitFor(() => {
      expect(projectUserApi.getProjectUsers).toHaveBeenCalledWith(projectId);
    });
  });

  it('renders the edit task modal correctly with task data', async () => {
    await React.act(async () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          task={mockTask}
          projectId={projectId}
          onSuccess={mockOnSuccess}
        />
      );
    });

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    
    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Task');
    expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
    
    const statusSelect = screen.getByLabelText(/status/i);
    expect(statusSelect).toHaveValue('started');
    
    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toHaveValue('high');
    
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
  });

  it('closes the modal when Cancel button is clicked', async () => {
    await React.act(async () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          projectId={projectId}
          onSuccess={mockOnSuccess}
        />
      );
    });

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('submits the form to create a new task', async () => {
    taskApi.createTask.mockResolvedValue({ id: 2 });
    
    await React.act(async () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          projectId={projectId}
          onSuccess={mockOnSuccess}
        />
      );
    });

    await React.act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'New Task' },
      });
      
      fireEvent.change(screen.getByLabelText(/description/i), {
        target: { value: 'New Description' },
      });
    });
    
    await waitFor(() => {
      expect(screen.getByText('Select User')).toBeInTheDocument();
    });
    
    await React.act(async () => {
      fireEvent.change(screen.getByLabelText(/assign to/i), {
        target: { value: '101' },
      });
      
      fireEvent.change(screen.getByLabelText(/status/i), {
        target: { value: 'started' },
      });
      
      fireEvent.change(screen.getByLabelText(/priority/i), {
        target: { value: 'high' },
      });
    });
    
    await React.act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /create/i }));
    });
    
    // Check if createTask was called with the correct data
    await waitFor(() => {
      expect(taskApi.createTask).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Task',
        description: 'New Description',
        status: 'started',
        priority: 'high',
        project_id: projectId,
        assigned_to: 101,
      }));
      
      expect(toast.success).toHaveBeenCalledWith('Task created successfully');
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('submits the form to update an existing task', async () => {
    taskApi.updateTask.mockResolvedValue({ id: 1 });
    
    await React.act(async () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          task={mockTask}
          projectId={projectId}
          onSuccess={mockOnSuccess}
        />
      );
    });

    await React.act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'Updated Task Title' },
      });
    });
    
    await React.act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /update/i }));
    });
    
    await waitFor(() => {
      expect(taskApi.updateTask).toHaveBeenCalledWith(1, expect.objectContaining({
        title: 'Updated Task Title',
      }));
      
      expect(toast.success).toHaveBeenCalledWith('Task updated successfully');
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('handles API errors when creating a task', async () => {
    taskApi.createTask.mockRejectedValue(new Error('API Error'));
    
    await React.act(async () => {
      render(
        <TaskModal
          isOpen={true}
          onClose={mockOnClose}
          projectId={projectId}
          onSuccess={mockOnSuccess}
        />
      );
    });

    // Fill in the form
    await React.act(async () => {
      fireEvent.change(screen.getByLabelText(/title/i), {
        target: { value: 'New Task' },
      });
    });
    
    // Submit the form
    await React.act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /create/i }));
    });
    
    // Check if error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to create task');
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TaskModal
        isOpen={false}
        onClose={mockOnClose}
        projectId={projectId}
        onSuccess={mockOnSuccess}
      />
    );
    
    // Check if the modal is not rendered
    expect(container).toBeEmptyDOMElement();
  });
});
