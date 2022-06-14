import { useContext } from 'react';

import VaultContext from './VaultContext';

const useVault = () => {
  return useContext(VaultContext);
};

export default useVault;
