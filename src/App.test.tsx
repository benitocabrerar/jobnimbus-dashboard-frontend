// src/App.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('Dashboard JobNimbus MCP', () => {
  it('renderiza el título principal', () => {
    render(<App />);
    expect(screen.getByText(/JobNimbus MCP - Dashboard Gerencial/i)).toBeInTheDocument();
  });

  it('muestra el KPI de Productividad', () => {
    render(<App />);
    expect(screen.getByText(/Productividad/i)).toBeInTheDocument();
    expect(screen.getByText(/92%/i)).toBeInTheDocument();
  });

  it('incluye el chat asistente', () => {
    render(<App />);
    expect(screen.getByText(/Chat Asistente/i)).toBeInTheDocument();
  });
});