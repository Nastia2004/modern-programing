import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MetricCard from '../../src/components/MetricCard.jsx';

describe('MetricCard', () => {
  it('shows label, value and detail', () => {
    render(<MetricCard label="Projects" value={3} detail="2 active" />);

    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2 active')).toBeInTheDocument();
  });
});
