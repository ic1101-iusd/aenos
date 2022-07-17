import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './Footer.scss';

const Footer = () => {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <div className={styles.footer}>
      <a target="_blank" href="https://github.com/ic1101-iusd" className={styles.link}>
        Github
      </a>
      <a target="_blank" href="https://twitter.com/iusd_ic" className={styles.link}>
        Twitter
      </a>
      <Link to={`${isHome ? '/stats' : '/'}`} className={styles.link}>
        {isHome ? 'Statistics' : 'Home'}
      </Link>
      <a href="mailto:ic1101.iusd@gmail.com" className={styles.link}>
        Write feedback
      </a>
    </div>
  )
};

export default Footer;
