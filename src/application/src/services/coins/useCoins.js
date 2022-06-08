import { useContext } from 'react';

import CoinsContext from './CoinsContext';

const useCoins = () => {
  return useContext(CoinsContext);
};

export default useCoins;
