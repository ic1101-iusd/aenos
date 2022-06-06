import React, { useMemo, useState, useEffect, useRef } from 'react';

import config from 'Constants/config';
import logger from 'Utils/logger';

import WalletContext from './WalletContext';

export const whitelist = [
  config.canisterIdVault,
  config.canisterIdUsbFt,
  config.canisterIdBtcFt,
];

const WalletProvider = ({ children }) => {
  const [principle, setPrinciple] = useState('');
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const plug = useRef(null);

  useEffect(() => {
    const verifyConnectionAndAgent = async () => {
      setIsWalletLoading(true);

      try {
        if (!window.ic.plug) return;

        plug.current = window.ic.plug;
        console.log(plug.current);
        const connected = await plug.current.isConnected();

        if (connected && !plug.current.agent) {
          await plug.current.createAgent({ whitelist });
        }

        if (connected && plug.current.agent) {
          const p = await plug.current.agent.getPrincipal();

          setPrinciple(p.toString());
        }
      } catch(e) {
        logger.error(e);
      } finally {
        setIsWalletLoading(false);
      }
    };

    verifyConnectionAndAgent();
  }, []);

  const value = useMemo(() => {
    return {
      principle,
      isLoggedIn: Boolean(principle),
      setPrinciple,
      plug,
      isWalletLoading,
      setIsWalletLoading,
    };
  }, [principle, isWalletLoading]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
};

export default WalletProvider;
