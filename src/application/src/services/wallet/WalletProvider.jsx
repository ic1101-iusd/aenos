import React, { useMemo, useRef } from 'react';

import useConnect from './useConnect';
import WalletContext from './WalletContext';

const WalletProvider = ({ children }) => {
  const plug = useRef(null);

  const {
    connect,
    disconnect,
    isConnecting,
    principle,
  } = useConnect({ plug });

  const value = useMemo(() => {
    return {
      principle,
      isLoggedIn: Boolean(principle),
      plug,
      isConnecting,
      connect,
      disconnect
    };
  }, [principle, isConnecting]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
};

export default WalletProvider;
