import { createContext } from 'react';

export const BTC_PRICE_MOCK = 20000;

const VaultContext = createContext({
  createPosition: () => {},
  updatePosition: () => {},
  getAccountPositions: () => {},
  deletePosition: () => {},
  getCollateralPrice: () => {},
  collateralPrice: BTC_PRICE_MOCK,
  positions: [],
  currentPosition: null,
});

export default VaultContext;
