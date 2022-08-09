import * as React from "react";
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';

import { WalletProvider } from 'Services/wallet';
import { CoinsProvider } from 'Services/coins';
import { VaultProvider } from 'Services/vault';
import ErrorBoundary from 'Containers/ErrorBoundary';

import App from './App';

import 'Styles/index.scss';
import '!style-loader!css-loader!rc-slider/assets/index.css';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#app');

const container = document.getElementById('app');

const root = createRoot(container);

import('./rollbar').then(() => {
  root.render(
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
});
