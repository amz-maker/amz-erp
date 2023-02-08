import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';

import Pages from 'pages';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="" element={<Pages.Main.Root />} />
        <Route path="/laboratory" element={<Pages.Main.Laboratory />} />
      </Routes>
    </div>
  );
}

export default App;
