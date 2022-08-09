import React, { useEffect } from 'react';
import ReactGA from 'react-ga';

import styles from './ErrorPage.scss';

const ErrorPage = () => {
  useEffect(() => {
    ReactGA.pageview('/error-page');
  }, []);

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorLabel}>Something went wrong</div>
    </div>
  );
};

export default ErrorPage;
