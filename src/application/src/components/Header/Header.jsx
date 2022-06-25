import React from 'react';
import { Link } from 'react-router-dom';

import Connect from 'Containers/Connect';
import logo from 'Assets/logo.png';

import styles from './Header.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <Link to="/">
        <img
          className={styles.logo}
          src={logo}
          alt="IC1101"
        />
      </Link>

      <Connect />
    </div>
  )
};

export default Header;
