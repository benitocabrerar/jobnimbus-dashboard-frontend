// Punto de entrada principal React para JobNimbus MCP Frontend
import React from 'react';
import ReactDOM from 'react-dom/client';
// import App from './App';
import AppFixed from './AppFixed'; // Using CSS-based sidebar instead of Material-UI Drawer
// import SimpleApp from './SimpleApp'; // Temporarily use simple app for debugging

import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppFixed />
  </React.StrictMode>
);
