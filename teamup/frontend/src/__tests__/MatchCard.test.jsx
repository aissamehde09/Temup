import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MatchCard from '../components/MatchCard';

const baseMatch = {
  id: 1,
  title: 'Foot 5v5',
  city: 'Nanterre',
  location: 'Stade municipal',
  sport_name: 'Football',
  level: 'Intermédiaire',
  match_date: '2026-12-25',
  match_time: '16:00',
  max_players: 10,
  players_count: 6,
  image_url: '/img/test.png',
};

function renderMatch(overrides = {}) {
  return render(
    <MemoryRouter>
      <MatchCard match={{ ...baseMatch, ...overrides }} />
    </MemoryRouter>,
  );
}

describe('MatchCard', () => {
  it('renders match title', () => {
    renderMatch();
    expect(screen.getByText('Foot 5v5')).toBeInTheDocument();
  });

  it('renders sport and level badges', () => {
    renderMatch();
    expect(screen.getByText('Football')).toBeInTheDocument();
    expect(screen.getByText('Intermédiaire')).toBeInTheDocument();
  });

  it('renders player count', () => {
    renderMatch();
    expect(screen.getByText(/6 \/ 10/)).toBeInTheDocument();
  });

  it('calculates places left correctly', () => {
    renderMatch({ players_count: 8, max_players: 10 });
    expect(screen.getByText(/2 places/)).toBeInTheDocument();
  });

  it('renders image with alt text', () => {
    renderMatch();
    const img = screen.getByAltText('Illustration du match Foot 5v5');
    expect(img).toBeInTheDocument();
  });

  it('uses fallback image when no image_url', () => {
    renderMatch({ image_url: '' });
    const img = screen.getByAltText('Illustration du match Foot 5v5');
    expect(img.src).toContain('teamup-basketball-original.png');
  });

  it('has link to match detail', () => {
    renderMatch();
    const link = screen.getByText('Voir').closest('a');
    expect(link.getAttribute('href')).toBe('/matches/1');
  });
});
