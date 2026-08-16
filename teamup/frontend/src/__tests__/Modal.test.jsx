import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Modal from '../components/Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} title="Test" onClose={() => {}}>Content</Modal>);
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renders content when open', () => {
    render(<Modal open={true} title="Mon modal" onClose={() => {}}>Hello</Modal>);
    expect(screen.getByText('Mon modal')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<Modal open={true} title="Info" onClose={() => {}}>Content</Modal>);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
  });

  it('calls onClose when clicking overlay', async () => {
    const onClose = vi.fn();
    render(<Modal open={true} title="Close test" onClose={onClose}>Content</Modal>);
    const overlay = screen.getByText('Content').closest('[role="none"]');
    overlay.click();
    expect(onClose).toHaveBeenCalled();
  });

  it('does not call onClose when clicking inside dialog', async () => {
    const onClose = vi.fn();
    render(<Modal open={true} title="No close" onClose={onClose}>Content</Modal>);
    screen.getByRole('dialog').click();
    expect(onClose).not.toHaveBeenCalled();
  });
});
