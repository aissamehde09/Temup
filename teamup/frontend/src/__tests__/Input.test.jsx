import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../components/Input';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('links label to input via htmlFor/id', () => {
    render(<Input label="Password" />);
    const input = screen.getByLabelText('Password');
    expect(input.tagName).toBe('INPUT');
    expect(input.id).toBeTruthy();
  });

  it('applies custom id when provided', () => {
    render(<Input label="Name" id="custom-id" />);
    expect(screen.getByLabelText('Name').id).toBe('custom-id');
  });

  it('displays error message', () => {
    render(<Input label="Email" error="Ce champ est requis" />);
    expect(screen.getByText('Ce champ est requis')).toBeInTheDocument();
  });

  it('calls onChange handler', async () => {
    const onChange = vi.fn();
    render(<Input label="Name" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Name'), 'A');
    expect(onChange).toHaveBeenCalled();
  });

  it('passes additional props to input', () => {
    render(<Input label="Email" type="email" required />);
    const input = screen.getByLabelText('Email');
    expect(input.type).toBe('email');
    expect(input.required).toBe(true);
  });

  it('applies custom className', () => {
    render(<Input label="Test" className="custom-class" />);
    expect(screen.getByLabelText('Test').className).toContain('custom-class');
  });
});
