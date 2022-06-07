import React from 'react';

import styles from './CoinIcon.scss';

const CoinIcon = ({ src, symbol }) => {
  return (
    <img
      className={styles.coinIcon}
      src={src}
      alt={symbol}
    />
  )
};

export default CoinIcon;
