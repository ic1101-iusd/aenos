import { useEffect, useCallback, useState } from 'react';

import logger from 'Utils/logger';
import { SIGNED_WALLET_STORAGE_KEY, WALLETS } from 'Constants/common';
import wallets from 'Services/wallet/wallets';

const useConnect = () => {
  const [principle, setPrinciple] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async (wallet) => {
    try {
      const p = await wallets[wallet].connect();

      if (p) {
        setPrinciple(p);
        localStorage.setItem(SIGNED_WALLET_STORAGE_KEY, wallet);
      }
    } catch (err) {
      logger.error(err);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPrinciple(null);

    const wallet = localStorage.getItem(SIGNED_WALLET_STORAGE_KEY);
    localStorage.removeItem(SIGNED_WALLET_STORAGE_KEY);

    try {
      wallets[wallet].disconnect();

      setPrinciple(null);
    } catch (err) {
      logger.error(err);
    }
  }, []);

  const createActor = useCallback(async (idlFactory, canisterId) => {
    try {
      // default - anonymous identity for getting on-chain info for not logged-in user
      const wallet = localStorage.getItem(SIGNED_WALLET_STORAGE_KEY) ?? WALLETS.identity;

      return wallets[wallet].createActor(idlFactory, canisterId);
    } catch (err) {
      logger.error(err);
    }
  }, []);

  useEffect(() => {
    const verifyConnectionAndAgent = async () => {
      setIsConnecting(true);

      try {
        const wallet = localStorage.getItem(SIGNED_WALLET_STORAGE_KEY);

        if (!wallet) return;

        const p = await wallets[wallet].getPrincipal();

        if (p) {
          setPrinciple(p);
        } else {
          localStorage.removeItem(SIGNED_WALLET_STORAGE_KEY);
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
    createActor,
  };
};

export default useConnect;
