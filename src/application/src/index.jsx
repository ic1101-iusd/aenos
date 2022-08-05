import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';

import { WalletProvider } from 'Services/wallet';
import { CoinsProvider } from 'Services/coins';
import { VaultProvider } from 'Services/vault';

import App from './App';

import 'Styles/index.scss';
import '!style-loader!css-loader!rc-slider/assets/index.css';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

const container = document.getElementById('app');

Modal.setAppElement('#app');

const root = createRoot(container);

root.render(
  <BrowserRouter>
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
  </BrowserRouter>
);
