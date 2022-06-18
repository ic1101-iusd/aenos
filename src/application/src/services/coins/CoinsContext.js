import { createContext } from 'react';

const CoinsContext = createContext({
  coins: [],
  updateBalances: () => {},
  btc: null,
  iUsd: null,
});

export default CoinsContext;
