import React from 'react';

import styles from './ErrorPage.scss';

const ErrorPage = () => {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorLabel}>Something went wrong</div>
    </div>
  );
};

export default ErrorPage;
