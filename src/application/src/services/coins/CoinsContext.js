import { createContext } from 'react';

const CoinsContext = createContext({
  coins: [],
  fetchTokenData: () => {},
});

export default CoinsContext;
