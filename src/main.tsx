// Punto de entrada principal React para JobNimbus MCP Frontend
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import SimpleMonthlySummary from './views/SimpleMonthlySummary';
import { Login } from './views/Login';

import './style.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLoginSuccess = (token: string) => {
    setIsAuthenticated(true);
  };

  // Show nothing while checking authentication
  if (isChecking) {
    return null;
  }

  return (
    <>
      {isAuthenticated ? (
        <SimpleMonthlySummary />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
