import * as React from "react";
import { createRoot } from 'react-dom/client';

import { WalletProvider } from 'Services/wallet';

import App from './App';

import 'Styles/index.scss';

const container = document.getElementById('app');

const root = createRoot(container);

root.render(
  <>
    <WalletProvider>
      <App />
    </WalletProvider>
  </>
);
