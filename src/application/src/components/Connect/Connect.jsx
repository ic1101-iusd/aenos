import React, { useCallback } from 'react';

import Button from 'Components/Button';
import { whitelist, useWallet } from 'Services/wallet';

import styles from './Connect.scss';

const Connect = () => {
  const { setPrinciple, plug, isLoggedIn, principle } = useWallet();

  const connectHandler = useCallback(async () => {
    if (isLoggedIn) {
      plug.current.disconnect();
      return;
    }

    if (!plug.current) {
      window.open('https://plugwallet.ooo/','_blank');
      return;
    }

    const connected = await plug.current.requestConnect({ whitelist });

    if (!connected) return;

    if (!plug.current.agent) {
      await plug.current.current.createAgent({ whitelist });
    }

    const principle = await plug.current.agent.getPrincipal();

    setPrinciple(principle.toString());
  }, [isLoggedIn]);

  return (
    <Button
      className={styles.connectBtn}
      onClick={connectHandler}
    >
      {isLoggedIn && principle}
      {!isLoggedIn && 'Connect to Plug'}
    </Button>
  );
};

export default Connect;
