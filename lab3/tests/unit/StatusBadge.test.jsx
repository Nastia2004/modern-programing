import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import StatusBadge from '../../src/components/StatusBadge.jsx';

describe('StatusBadge', () => {
  it('renders a readable status label', () => {
    render(<StatusBadge value="in_progress" />);

    expect(screen.getByText('in progress')).toBeInTheDocument();
    expect(screen.getByText('in progress')).toHaveClass('status-badge', 'in_progress');
  });
});
