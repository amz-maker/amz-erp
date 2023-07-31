import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';

import Pages from 'pages';
import AssetLinks from 'applinks';
import WithMenuLayout from 'layout/WithMenuLayout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<WithMenuLayout />}>
          <Route path="" element={<Pages.Main.Root />} />
          <Route path="/sales" element={<Pages.Main.SalesCtrctInfoMangnt />} />
          <Route path="/order" element={<Pages.Main.OrderInfoMangnt />} />
          <Route path='/ctrct' element={<Pages.Main.CtrctInfoMangnt/>}/>
          <Route path='/mnpr' element={<Pages.Main.MnprCmtmtInfoMangnt/>}/>
          
        </Route>
        <Route path="/laboratory" element={<Pages.Main.Laboratory />} />
        <Route path="/.well-known/assetlinks.json" element={<AssetLinks/>} />
      </Routes>
    </div>
  );
}

export default App;
