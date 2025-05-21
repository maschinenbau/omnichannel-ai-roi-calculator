// File: src/App.tsx
// Purpose: Main application component that renders the ROI calculator.

import React from 'react'; // Ensure React is imported if not using the new JSX transform exclusively or for hooks.
import OmnichannelAiRoiCalculator from './OmnichannelAiRoiCalculator';
// If your Tailwind directives are in src/index.css (imported in main.tsx),
// you might not need to import a separate App.css here unless it's for App-specific styles.
// If you have an App.css with Tailwind directives, ensure it exists or change to './index.css' if that's your main CSS.
// For now, assuming Tailwind is handled by index.css via main.tsx.
// import './App.css'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8"> {/* Added responsive padding */}
      <OmnichannelAiRoiCalculator />
    </div>
  );
}