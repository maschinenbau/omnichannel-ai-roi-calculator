// File: src/App.tsx
// Purpose: Main application component that renders the ROI calculator.

import React from 'react'; // Explicit React import for clarity and older setups.
import OmnichannelAiRoiCalculator from './OmnichannelAiRoiCalculator';
import './index.css'; // Assuming this is your main CSS file with Tailwind directives.
                     // If you created a separate App.css for App-specific styles, import that instead.
                     // Ensure the imported CSS file exists and contains Tailwind directives if it's the primary one.

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <OmnichannelAiRoiCalculator />
    </div>
  );
}

export default App; // This line is CRUCIAL and ensures App can be default imported.
