import { useContext } from 'react';

import WalletContext from './WalletContext';

const useWallet = () => {
  return useContext(WalletContext);
};

export default useWallet;