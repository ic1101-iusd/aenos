import React from 'react';

import styles from './styles.scss';

const PositionStatus = ({ updating, deleted, liquidated }) => {
   if (updating) {
      return <span className={styles.updating}>Updating</span>;
    } else if (liquidated) {
      return <span className={styles.liquidated}>Liquidated</span>;
    } else if (deleted) {
      return <span className={styles.deleted}>Closed</span>;
    } else {
      return <span className={styles.active}>Active</span>;
    }
};

export default PositionStatus;
