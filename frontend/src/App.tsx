import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Welcome to TrtCrd</div>} />
      </Routes>
    </Router>
  );
};

export default App;