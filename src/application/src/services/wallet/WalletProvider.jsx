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
  const plug = useRef(null);

  useEffect(() => {
    const verifyConnectionAndAgent = async () => {
      try {
        plug.current = window.ic.plug;
        const connected = await plug.current.isConnected();

        if (connected && !plug.current.agent) {
          await plug.current.createAgent({ whitelist });
        }

        if (connected && plug.current.agent) {
          setPrinciple(plug.current.agent.getPrincipal());
        }
      } catch(e) {
        logger.error(e);
      }
    };

    verifyConnectionAndAgent();
  }, []);

  const value = useMemo(() => {
    return {
      principle,
      isLoggedIn: Boolean(principle),
      setPrinciple,
      plug: plug.current,
    };
  }, [principle]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
};

export default WalletProvider;
