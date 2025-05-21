import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';      // Correctly imports the default export from App.tsx
import './index.css';  // This should be your main CSS file where Tailwind directives are placed.

// The '!' after getElementById('root') is a non-null assertion operator.
// It tells TypeScript that you are sure 'root' element exists.
const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element. Ensure your index.html has an element with id='root'.");
}
