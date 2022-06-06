import React, { useCallback } from 'react';
import PlugConnect from '@psychedelic/plug-connect';

import { whitelist, useWallet } from 'Services/wallet';

const Connect = () => {
  const { setPrinciple, plug } = useWallet();

  const connectHandler = useCallback(async () => {
    if (!plug.agent) {
      await plug.current.createAgent({ whitelist });
    }

    const principle = await plug.agent.getPrincipal();

    setPrinciple(principle);
  }, []);

  return (
    <PlugConnect
      whitelist={whitelist}
      onConnectCallback={connectHandler}
    />
  )
};

export default Connect;
