import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { projectUserApi } from '@/services/client-services/project-users/api';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Sidebar from '@/components/ui/sidebar';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the UserContext
jest.mock('@/context/UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock the project-users API
jest.mock('@/services/client-services/project-users/api', () => ({
  projectUserApi: {
    getUserProjects: jest.fn(),
  }
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
}));

describe('Sidebar Component', () => {
  const mockPush = jest.fn();
  const mockLogout = jest.fn();
  
  const mockUser = {
    id: 1,
    fname: 'John Doe',
    email: 'john@example.com',
  };
  
  const mockProjects = [
    { project_id: 1, project_name: 'Project 1' },
    { project_id: 2, project_name: 'Project 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the router
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    
    // Mock the user context
    (useUser as jest.Mock).mockReturnValue({
      user: mockUser,
      logout: mockLogout,
    });
    
    // Mock the API response
    projectUserApi.getUserProjects.mockResolvedValue(mockProjects);
    
    // Mock window.innerWidth for responsive testing
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024, // Default to desktop view
    });
    
    // Mock window.addEventListener
    window.addEventListener = jest.fn();
    window.removeEventListener = jest.fn();
  });

  it('renders the sidebar with user information', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Check if the sidebar title is rendered
    expect(screen.getByText('Project Manager')).toBeInTheDocument();
    
    // Check if user information is displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    
    // Check if main menu items are rendered
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Teams')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    
    // Check if projects section is rendered
    expect(screen.getByText('My Projects')).toBeInTheDocument();
    
    // Check if logout button is rendered
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('fetches and displays user projects', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Check if the API was called
    expect(projectUserApi.getUserProjects).toHaveBeenCalledWith(1);
    
    // Wait for projects to be loaded
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });
  });

  it('toggles the projects dropdown when clicked', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Get the dropdown button
    const dropdownButton = screen.getByText('My Projects').closest('button');
    
    // Initially, dropdown should be open (as per component's default state)
    expect(screen.getByText('+ New Project')).toBeInTheDocument();
    
    // Click to close the dropdown
    await React.act(async () => {
      fireEvent.click(dropdownButton!);
    });
    
    // The "New Project" button should not be visible
    expect(screen.queryByText('+ New Project')).not.toBeInTheDocument();
    
    // Click to open the dropdown again
    await React.act(async () => {
      fireEvent.click(dropdownButton!);
    });
    
    // The "New Project" button should be visible again
    expect(screen.getByText('+ New Project')).toBeInTheDocument();
  });

  it('navigates to the correct routes when menu items are clicked', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Click on Dashboard menu item
    await React.act(async () => {
      fireEvent.click(screen.getByText('Dashboard'));
    });
    expect(mockPush).toHaveBeenCalledWith('/workspace');
    
    // Click on Teams menu item
    await React.act(async () => {
      fireEvent.click(screen.getByText('Teams'));
    });
    expect(mockPush).toHaveBeenCalledWith('/workspace/teams');
    
    // Click on Settings menu item
    await React.act(async () => {
      fireEvent.click(screen.getByText('Settings'));
    });
    expect(mockPush).toHaveBeenCalledWith('/workspace/settings');
  });

  it('navigates to project page when a project is clicked', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Wait for projects to be loaded
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
    });
    
    // Click on a project
    await React.act(async () => {
      fireEvent.click(screen.getByText('Project 1'));
    });
    
    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/workspace/projects/1');
  });

  it('navigates to new project page when "New Project" is clicked', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Click on "New Project" button
    await React.act(async () => {
      fireEvent.click(screen.getByText('+ New Project'));
    });
    
    // Check if router.push was called with the correct path
    expect(mockPush).toHaveBeenCalledWith('/workspace/projects/new');
  });

  it('logs out the user when logout button is clicked', async () => {
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Click on the logout button
    await React.act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });
    
    // Check if logout function was called
    expect(mockLogout).toHaveBeenCalledTimes(1);
    
    // Check if router.push was called with the login path
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('displays mobile menu button on small screens', async () => {
    // Set window width to mobile size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 600,
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Check if mobile menu button is rendered
    const menuButton = screen.getByRole('button', { name: '' });
    expect(menuButton).toBeInTheDocument();
  });

  it('shows "Loading..." when projects are being fetched', async () => {
    // Don't resolve the API call yet
    projectUserApi.getUserProjects.mockReturnValue(new Promise(() => {}));
    
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Check if loading message is displayed
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows "No projects found" when user has no projects', async () => {
    // Return empty projects array
    projectUserApi.getUserProjects.mockResolvedValue([]);
    
    await React.act(async () => {
      render(<Sidebar />);
    });
    
    // Wait for projects to be "loaded"
    await waitFor(() => {
      expect(screen.getByText('No projects found')).toBeInTheDocument();
    });
  });
});
