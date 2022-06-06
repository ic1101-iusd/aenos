import { createContext } from 'react';

const WalletContext = createContext({
  plug: null,
  principle: '',
  isLoggedIn: false,
  setPrinciple: () => {},
  isWalletLoading: false,
  setIsWalletLoading: () => {},
});

export default WalletContext;
