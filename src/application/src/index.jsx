import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';

import { WalletProvider } from 'Services/wallet';
import { CoinsProvider } from 'Services/coins';
import { VaultProvider } from 'Services/vault';

import App from './App';

import 'Styles/index.scss';
import '!style-loader!css-loader!rc-slider/assets/index.css';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('app');

const root = createRoot(container);

root.render(
  <>
    <WalletProvider>
      <CoinsProvider>
        <VaultProvider>
          <App />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </VaultProvider>
      </CoinsProvider>
    </WalletProvider>
  </>
);
