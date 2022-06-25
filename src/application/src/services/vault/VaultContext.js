import { createContext } from 'react';

const VaultContext = createContext({
  createPosition: () => {},
  updatePosition: () => {},
  getAccountPositions: () => {},
  closePosition: () => {},
  getCollateralPrice: () => {},
  collateralPrice: 0,
  positions: [],
  currentPosition: null,
  setCurrentPosition: () => {},
  allPositions: [],
  getAllPositions: () => {},
});

export default VaultContext;
