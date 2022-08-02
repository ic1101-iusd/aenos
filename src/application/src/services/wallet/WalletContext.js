import { createContext } from 'react';

const WalletContext = createContext({
  principle: '',
  isLoggedIn: false,
  isConnecting: false,
  connect: () => {},
  disconnect: () => {},
  createActor: () => {},
});

export default WalletContext;
