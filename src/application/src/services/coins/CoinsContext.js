import { createContext } from 'react';

const CoinsContext = createContext({
  coins: [],
  updateBalances: () => {},
  btc: null,
  ais: null,
});

export default CoinsContext;
