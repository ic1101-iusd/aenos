import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import styles from './Footer.scss';
import ReactGA from 'react-ga';

const onGithubClick = () => {
  ReactGA.event({
    category: 'User',
    action: 'Github link clicked',
  });
};

const onTwitterClick = () => {
  ReactGA.event({
    category: 'User',
    action: 'Twitter link clicked',
  });
};

const onStatsClick = () => {
  ReactGA.event({
    category: 'User',
    action: 'Statistics link clicked',
  });
};

const onFeedbackClick = () => {
  ReactGA.event({
    category: 'User',
    action: 'Feedback link clicked',
  });
};

const Footer = () => {
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <div className={styles.footer}>
      <a target="_blank" href="https://github.com/ic1101-iusd" className={styles.link} onClick={onGithubClick}>
        Github
      </a>
      <a target="_blank" href="https://twitter.com/iusd_ic" className={styles.link} onClick={onTwitterClick}>
        Twitter
      </a>
      <Link to={`${isHome ? '/stats' : '/'}`} className={styles.link} onClick={onStatsClick}>
        {isHome ? 'Statistics' : 'Home'}
      </Link>
      <a href="mailto:ic1101.iusd@gmail.com" className={styles.link} onClick={onFeedbackClick}>
        Write feedback
      </a>
    </div>
  )
};

export default Footer;
