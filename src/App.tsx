// src/App.tsx
import React from "react";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-indigo-100 flex items-center justify-center">
      <Home />
    </div>
  );
};

export default App;
