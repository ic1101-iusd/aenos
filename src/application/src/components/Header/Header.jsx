import React from 'react';

import Connect from 'Components/Connect';
import logo from 'Assets/logo.png';

import styles from './Header.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <img
        className={styles.logo}
        src={logo}
        alt="IC1101"
      />

      <Connect />
    </div>
  )
};

export default Header;
