import React from 'react';

import styles from './styles.scss';

const Principle = ({ value }) => {
  return (
    <div className={styles.principle}>
      {value}
    </div>
  )
};

export default Principle;
