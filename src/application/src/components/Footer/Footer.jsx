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
      <Link to={`${isHome ? '/stats' : '/'}`} className={styles.link}>
        {isHome ? 'Statistics' : 'Home'}
      </Link>
      <a href="mailto:ihor.verkhohliad@gmail.com" className={styles.link}>
        Write feedback
      </a>
    </div>
  )
};

export default Footer;
