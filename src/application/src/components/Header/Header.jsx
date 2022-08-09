import React from 'react';
import { Link } from 'react-router-dom';
import ReactGA from 'react-ga';

import Connect from 'Containers/Connect';
import logo from 'Assets/logo.png';

import styles from './Header.scss';

const onLogoClicked = () => {
  ReactGA.event({
    category: 'User',
    action: 'Logo clicked',
  });
};

const Header = () => {
  return (
    <div className={styles.header}>
      <Link to="/" className={styles.logoLink} onClick={onLogoClicked}>
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
