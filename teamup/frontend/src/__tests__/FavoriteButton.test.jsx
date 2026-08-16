import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FavoriteButton from '../components/FavoriteButton';

describe('FavoriteButton', () => {
  it('shows "Ajouter aux favoris" when inactive', () => {
    render(<FavoriteButton active={false} onClick={() => {}} />);
    expect(screen.getByText('Ajouter aux favoris')).toBeInTheDocument();
  });

  it('shows "Ajouté aux favoris" when active', () => {
    render(<FavoriteButton active={true} onClick={() => {}} />);
    expect(screen.getByText('Ajouté aux favoris')).toBeInTheDocument();
  });

  it('sets aria-pressed correctly', () => {
    const { rerender } = render(<FavoriteButton active={false} onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(<FavoriteButton active={true} onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<FavoriteButton active={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
