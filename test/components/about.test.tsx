import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../../src/components/about';

describe('About Component', () => {
  test('renders Wave Reader title', () => {
    render(<About />);
    expect(screen.getByText('🌊 Wave Reader')).toBeInTheDocument();
  });

  test('renders description text', () => {
    render(<About />);
    expect(screen.getByText(/Wave Reader is a browser extension/)).toBeInTheDocument();
  });

  test('renders How It Works section', () => {
    render(<About />);
    expect(screen.getByText('How It Works')).toBeInTheDocument();
  });

  test('renders Features section', () => {
    render(<About />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  test('renders Support section', () => {
    render(<About />);
    expect(screen.getByText('Support Wave Reader')).toBeInTheDocument();
  });

  test('renders donation image', () => {
    render(<About />);
    const image = screen.getByAltText('Ethereum QR Code');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'receive_eth.jpg');
  });

  test('renders version information', () => {
    render(<About />);
    expect(screen.getByText(/Version 1.0.0/)).toBeInTheDocument();
  });
}); 