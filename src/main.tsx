// Punto de entrada principal React para JobNimbus MCP Frontend
import React from 'react';
import ReactDOM from 'react-dom/client';
import SimpleMonthlySummary from './views/SimpleMonthlySummary';

import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SimpleMonthlySummary />
  </React.StrictMode>
);
