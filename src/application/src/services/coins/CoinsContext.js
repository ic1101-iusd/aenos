import { createContext } from 'react';

const CoinsContext = createContext({
  coins: [],
  fetchTokenData: () => {},
  btc: null,
  ais: null,
});

export default CoinsContext;
