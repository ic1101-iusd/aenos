import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Button from 'Components/Button';
import { useWallet } from 'Services/wallet';
import { useCoins } from 'Services/coins';

import styles from './Connect.scss';

const Connect = () => {
  const { connect, disconnect, isLoggedIn, principle } = useWallet();
  const { dropBtc } = useCoins();
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  const connectHandler = useCallback(async () => {
    if (isLoggedIn) {
      disconnect();
      return;
    }

    connect();
  }, [isLoggedIn]);

  return (
    <div className={styles.buttons}>
      <Link to={isHome ? '/stats' : '/'}>
        <Button className={styles.drop}>
          {isHome ? 'Stats' : 'Home'}
        </Button>
      </Link>
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
