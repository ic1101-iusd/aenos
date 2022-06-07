import { createContext } from 'react';

const WalletContext = createContext({
  plug: null,
  principle: '',
  isLoggedIn: false,
  setPrinciple: () => {},
  isWalletLoading: false,
  setIsWalletLoading: () => {},
  balances: [],
});

export default WalletContext;
