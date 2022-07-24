import { useEffect, useCallback, useState } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from 'Declarations/protocol';

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
    // const authClient = await AuthClient.create();
    //
    // authClient.login({
    //   // 7 days in nanoseconds
    //   maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
    //   onSuccess: async (ss) => {
    //     console.log('login success', authClient, ss);
    //
    //     const identity = await authClient.getIdentity();
    //     // const actor = Actor.createActor(idlFactory, {
    //     //   agent: new HttpAgent({
    //     //     identity,
    //     //   }),
    //     //   canisterId: config.canisterIdVault,
    //     // });
    //
    //     console.log({ identity });
    //   },
    // });
    //
    // return;

    if (!plug.current) {
      window.open('https://plugwallet.ooo/','_blank');
      return;
    }

    const connected = await plug.current.requestConnect({
      whitelist,
      host: config.HOST,
    });

    if (!connected) return;

    if (!plug.current.agent) {
      await plug.current.createAgent({
        whitelist,
        host: config.HOST,
      });
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
      //
      // const authClient = await AuthClient.create();
      //
      // const identity = await authClient.getIdentity();
      //
      // console.log({ identity, principle: identity.getPrincipal().toString() });
      //
      // return;

      try {
        if (!window.ic.plug) return;

        plug.current = window.ic.plug;

        const storedPrinciple = localStorage.getItem(PRINCIPLE_KEY);

        // todo: comment temporary, maybe remove later
        // if (storedPrinciple) {
        //   setPrinciple(Principal.fromText(storedPrinciple));
        //   return;
        // }

        const connected = await plug.current.isConnected();

        if (connected && !plug.current.agent) {
          await plug.current.createAgent({
            whitelist,
            host: config.HOST,
          });
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
