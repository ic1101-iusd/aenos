import React, { useMemo, useState, useEffect, useRef } from 'react';

import config from 'Constants/config';
import logger from 'Utils/logger';

import WalletContext from './WalletContext';

export const whitelist = [
  config.canisterIdVault,
  config.canisterIdUsbFt,
  config.canisterIdBtcFt,
];

const coins = [
  config.canisterIdBtcFt,
  config.canisterIdUsbFt,
];

const WalletProvider = ({ children }) => {
  const [principle, setPrinciple] = useState('');
  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [balances, setBalances] = useState([]);

  const plug = useRef(null);

  useEffect(() => {
    const verifyConnectionAndAgent = async () => {
      setIsWalletLoading(true);

      try {
        if (!window.ic.plug) return;

        plug.current = window.ic.plug;
        const connected = await plug.current.isConnected();

        if (connected && !plug.current.agent) {
          await plug.current.createAgent({ whitelist });
        }

        if (connected && plug.current.agent) {
          const p = await plug.current.agent.getPrincipal();

          setPrinciple(p.toString());

          // TODO: get balances through network, not plug
          const b = await plug.current.requestBalance();

          setBalances(
            b.filter(bal => coins.includes(bal.canisterId))
          );
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
      balances,
    };
  }, [principle, isWalletLoading, balances]);

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
};

export default WalletProvider;
