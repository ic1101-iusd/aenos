import React, { useMemo } from 'react';

import useConnect from './useConnect';
import WalletContext from './WalletContext';

const WalletProvider = ({ children }) => {
  const {
    connect,
    disconnect,
    isConnecting,
    principle,
    createActor,
  } = useConnect();

  const value = useMemo(() => {
    return {
      principle,
      isLoggedIn: Boolean(principle),
      isConnecting,
      connect,
      disconnect,
      createActor,
    };
  }, [principle, isConnecting]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
};

export default WalletProvider;
