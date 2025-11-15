import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Typography, Button } from '@mui/material';

// Simple test component
const TestComponent = () => (
  <div>
    <Typography variant="h1">Test Component</Typography>
    <Button variant="contained">Click me</Button>
  </div>
);

describe('Simple Component Test', () => {
  test('renders test component correctly', () => {
    render(<TestComponent />);
    
    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });
});