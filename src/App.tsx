import React from 'react'; // Keep React import for clarity and compatibility.
import OmnichannelAiRoiCalculator from './OmnichannelAiRoiCalculator';
// Assuming Tailwind CSS directives are in 'src/index.css' and imported in 'src/main.tsx'.
// If you have App-specific styles (not Tailwind utility classes), you can create and import './App.css'.
// For a simple setup where all Tailwind styles are global via index.css, this import might not be needed.
// import './App.css'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-8">
      <OmnichannelAiRoiCalculator />
    </div>
  );
}

export default App; // This line is crucial