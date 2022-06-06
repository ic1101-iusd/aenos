import { createContext } from 'react';

const WalletContext = createContext({
  plug: null,
  principle: '',
  isLoggedIn: false,
  setPrinciple: () => {},
});

export default WalletContext;
