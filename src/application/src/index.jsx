import * as React from "react";
import { render } from "react-dom";

import { WalletProvider } from 'Services/wallet';

import App from './App';

render(
  <>
    <WalletProvider>
      <App />
    </WalletProvider>
  </>
, window.document.getElementById("app"));
