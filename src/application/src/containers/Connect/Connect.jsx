import React, { useCallback } from 'react';

import Button from 'Components/Button';
import { useWallet } from 'Services/wallet';
import { useCoins } from 'Services/coins';

import styles from './Connect.scss';

const Connect = () => {
  const { connect, disconnect, isLoggedIn, principle } = useWallet();
  const { dropBtc } = useCoins();

  const connectHandler = useCallback(async () => {
    if (isLoggedIn) {
      disconnect();
      return;
    }

    connect();
  }, [isLoggedIn]);

  return (
    <div className={styles.buttons}>
      {isLoggedIn && (
        <Button
          className={styles.drop}
          onClick={dropBtc}
        >
          Get 1 BTC
        </Button>
      )}
      <Button
        className={styles.connectBtn}
        onClick={connectHandler}
      >
        {isLoggedIn && principle.toString()}
        {!isLoggedIn && 'Connect to Plug'}
      </Button>
    </div>
  );
};

export default Connect;
