import React, { useCallback } from 'react';

import Button from 'Components/Button';
import { useWallet } from 'Services/wallet';

import styles from './Connect.scss';

const Connect = () => {
  const { connect, disconnect, isLoggedIn, principle } = useWallet();

  const connectHandler = useCallback(async () => {
    if (isLoggedIn) {
      disconnect();
      return;
    }

    connect();
  }, [isLoggedIn]);

  return (
    <Button
      className={styles.connectBtn}
      onClick={connectHandler}
    >
      {isLoggedIn && principle.toString()}
      {!isLoggedIn && 'Connect to Plug'}
    </Button>
  );
};

export default Connect;
