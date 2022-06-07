import { createContext } from 'react';

const WalletContext = createContext({
  plug: null,
  principle: '',
  isLoggedIn: false,
  isConnecting: false,
  connect: () => {},
  disconnect: () => {},
});

export default WalletContext;
