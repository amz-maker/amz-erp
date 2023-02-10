import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.scss';
import App from './App';
import { RecoilRoot } from 'recoil';
import 'react-datasheet-grid/dist/style.css';

const Root = createRoot(document.getElementById('root')!);

Root.render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>,
);
