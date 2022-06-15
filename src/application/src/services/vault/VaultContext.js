import { createContext } from 'react';

const VaultContext = createContext({
  createPosition: () => {},
  updatePosition: () => {},
  getAccountPositions: () => {},
  deletePosition: () => {},
  getCollateralPrice: () => {},
  collateralPrice: 0,
  positions: [],
  currentPosition: null,
});

export default VaultContext;
