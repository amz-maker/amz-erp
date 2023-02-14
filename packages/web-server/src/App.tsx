import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';

import Pages from 'pages';
import WithMenuLayout from 'layout/WithMenuLayout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<WithMenuLayout />}>
          <Route path="" element={<Pages.Main.Root />} />
          <Route path="/sales" element={<Pages.Main.SalesCtrctInfoMangnt />} />
        </Route>
        <Route path="/laboratory" element={<Pages.Main.Laboratory />} />
      </Routes>
    </div>
  );
}

export default App;
