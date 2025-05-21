// File: src/App.tsx
// Purpose: Main application component that renders the ROI calculator.

// import React from 'react'; // Removed as it's often not needed with new JSX transform and can cause TS6133
import OmnichannelAiRoiCalculator from './OmnichannelAiRoiCalculator';
import './index.css'; // Assuming this is your main CSS file with Tailwind directives.

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <OmnichannelAiRoiCalculator />
    </div>
  );
}

export default App;
