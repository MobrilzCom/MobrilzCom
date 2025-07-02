import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeacherList from '../components/TeacherList';

// Mock fetch to avoid actual API calls
global.fetch = jest.fn();

describe('TeacherList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders teacher list with pagination', async () => {
    render(<TeacherList />);
    
    // Wait for mock data to load first
    await waitFor(() => {
      expect(screen.getByText('Teacher 1')).toBeInTheDocument();
    });

    // Check if the table headers are rendered
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Experience (years)')).toBeInTheDocument();

    // Check pagination info
    expect(screen.getByText('Showing 1-10 of 95 teachers')).toBeInTheDocument();
    
    // Check pagination buttons
    expect(screen.getByText('← Previous')).toBeInTheDocument();
    expect(screen.getByText('Next →')).toBeInTheDocument();
  });

  test('changes page size', async () => {
    render(<TeacherList />);
    
    await waitFor(() => {
      expect(screen.getByText('Teacher 1')).toBeInTheDocument();
    });

    // Change page size to 5
    const pageSizeSelect = screen.getByLabelText('Teachers per page:');
    fireEvent.change(pageSizeSelect, { target: { value: '5' } });

    await waitFor(() => {
      expect(screen.getByText('Showing 1-5 of 95 teachers')).toBeInTheDocument();
    });
  });

  test('navigates between pages', async () => {
    render(<TeacherList />);
    
    await waitFor(() => {
      expect(screen.getByText('Teacher 1')).toBeInTheDocument();
    });

    // Click next page
    const nextButton = screen.getByText('Next →');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Showing 11-20 of 95 teachers')).toBeInTheDocument();
    });
  });
});