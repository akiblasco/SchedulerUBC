import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseInput from '../../components/CourseInput';

describe('CourseInput', () => {
  const mockOnCourseAdd = vi.fn();
  const mockOnBulkUpload = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<CourseInput onCourseAdd={mockOnCourseAdd} onBulkUpload={mockOnBulkUpload} />);
    
    expect(screen.getByPlaceholderText('CPSC 110')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Computation, Programs, and Programming')).toBeInTheDocument();
    expect(screen.getByLabelText(/student count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/preferred time/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<CourseInput onCourseAdd={mockOnCourseAdd} onBulkUpload={mockOnBulkUpload} />);
    
    await userEvent.type(screen.getByPlaceholderText('CPSC 110'), 'CPSC 110');
    await userEvent.type(
      screen.getByPlaceholderText('Computation, Programs, and Programming'),
      'Introduction to Programming'
    );
    await userEvent.type(screen.getByLabelText(/student count/i), '200');
    
    fireEvent.click(screen.getByText('Add Course'));
    
    expect(mockOnCourseAdd).toHaveBeenCalledWith(expect.objectContaining({
      code: 'CPSC 110',
      name: 'Introduction to Programming',
      studentCount: 200
    }));
  });

  it('handles file upload', async () => {
    render(<CourseInput onCourseAdd={mockOnCourseAdd} onBulkUpload={mockOnBulkUpload} />);
    
    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/bulk upload/i);
    
    await userEvent.upload(input, file);
    
    expect(mockOnBulkUpload).toHaveBeenCalledWith(file);
  });
});