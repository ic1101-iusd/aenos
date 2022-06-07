import { useEffect, useCallback, useState } from 'react';
import { Principal } from '@dfinity/principal';

import logger from 'Utils/logger';
import config from 'Constants/config';
import { PRINCIPLE_KEY } from 'Constants/storageKeys';

export const whitelist = [
  config.canisterIdVault,
  config.canisterIdUsbFt,
  config.canisterIdBtcFt,
];

const useConnect = ({ plug }) => {
  const [principle, setPrinciple] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    if (!plug.current) {
      window.open('https://plugwallet.ooo/','_blank');
      return;
    }

    const connected = await plug.current.requestConnect({ whitelist });

    if (!connected) return;

    if (!plug.current.agent) {
      await plug.current.current.createAgent({ whitelist });
    }

    const p = await plug.current.agent.getPrincipal();

    setPrinciple(p);
    localStorage.setItem(PRINCIPLE_KEY, p.toString());
  }, []);

  const disconnect = useCallback(() => {
    plug.current.disconnect();
    setPrinciple(null);
    localStorage.removeItem(PRINCIPLE_KEY);
  }, []);

  useEffect(() => {
    const verifyConnectionAndAgent = async () => {
      setIsConnecting(true);

      try {
        const storedPrinciple = localStorage.getItem(PRINCIPLE_KEY);
        if (storedPrinciple) {
          setPrinciple(Principal.fromText(storedPrinciple));
          return;
        }

        if (!window.ic.plug) return;

        plug.current = window.ic.plug;
        const connected = await plug.current.isConnected();

        if (connected && !plug.current.agent) {
          await plug.current.createAgent({ whitelist });
        }

        if (connected && plug.current.agent) {
          const p = await plug.current.agent.getPrincipal();

          setPrinciple(p);
          localStorage.setItem(PRINCIPLE_KEY, p.toString());
        }
      } catch(e) {
        logger.error(e);
      } finally {
        setIsConnecting(false);
      }
    };

    verifyConnectionAndAgent();
  }, []);

  return {
    isConnecting,
    principle,
    connect,
    disconnect,
  };
};

export default useConnect;
