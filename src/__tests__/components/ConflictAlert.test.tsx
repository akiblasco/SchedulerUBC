import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConflictAlert from '../../components/ConflictAlert';

describe('ConflictAlert', () => {
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when no conflicts', () => {
    const { container } = render(<ConflictAlert conflicts={[]} onDismiss={mockOnDismiss} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders conflicts with dismiss buttons', () => {
    const conflicts = ['Conflict 1', 'Conflict 2'];
    render(<ConflictAlert conflicts={conflicts} onDismiss={mockOnDismiss} />);
    
    conflicts.forEach(conflict => {
      expect(screen.getByText(conflict)).toBeInTheDocument();
    });
    
    const dismissButtons = screen.getAllByRole('button');
    expect(dismissButtons).toHaveLength(conflicts.length);
  });

  it('calls onDismiss with correct index', () => {
    const conflicts = ['Conflict 1', 'Conflict 2'];
    render(<ConflictAlert conflicts={conflicts} onDismiss={mockOnDismiss} />);
    
    const dismissButtons = screen.getAllByRole('button');
    fireEvent.click(dismissButtons[1]);
    
    expect(mockOnDismiss).toHaveBeenCalledWith(1);
  });
});