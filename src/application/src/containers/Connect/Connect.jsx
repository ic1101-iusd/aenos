import React, { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import cn from 'classnames';

import Button from 'Components/Button';
import { useWallet } from 'Services/wallet';
import { useCoins } from 'Services/coins';
import { WALLETS } from 'Constants/common';
import styleVariables from 'Styles/variables.scss';

import styles from './Connect.scss';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: styleVariables.background,
    border: 'none',
    color: 'white',
    width: '300px',
    textAlign: 'center',
    borderRadius: '15px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  }
};

const Connect = () => {
  const { connect, disconnect, isLoggedIn, principle } = useWallet();
  const { dropBtc } = useCoins();
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  const [modalIsOpen, setIsOpen] = useState(false);

  const toggleModal = useCallback(() => {
    if (isLoggedIn) {
      disconnect();
    } else {
      setIsOpen(current => !current);
    }
  }, [isLoggedIn]);

  const connectHandler = useCallback((wallet) => {
    connect(wallet);

    setIsOpen(false);
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
        onClick={toggleModal}
      >
        {isLoggedIn && principle.toString()}
        {!isLoggedIn && 'Connect'}
      </Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        style={customStyles}
      >
        <h1>Connect with</h1>

        <Button
          className={cn([styles.connectBtn, styles.walletBtn])}
          onClick={connectHandler.bind(null, WALLETS.plug)}
        >
          Plug
        </Button>
        <Button
          className={cn([styles.connectBtn, styles.walletBtn])}
          onClick={connectHandler.bind(null, WALLETS.identity)}
        >
          Internet Identity
        </Button>
      </Modal>
    </div>
  );
};

export default Connect;
