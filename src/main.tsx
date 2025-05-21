import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';      // Imports App.tsx
import './index.css';  // This should be your main CSS file where Tailwind directives are placed.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
