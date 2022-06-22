import React from 'react';

import CoinIcon from 'Components/CoinIcon';
import { useCoins } from 'Services/coins';
import { formatCoins } from 'Utils/formatters';

import styles from './CoinBalances.scss';

const CoinBalances = () => {
  const { coins } = useCoins();

  return (
    <div className={styles.coinBalances}>
      {coins.map(coin => {
        return (
          <div
            className={styles.balance}
            key={coin.id}
          >
            <div className={styles.leftGroup}>
              <CoinIcon
                src={coin.logo}
                symbol={coin.symbol}
              />
              <div className={styles.label}>
                <span className={styles.name}>
                  {coin.name}
                </span>
                <span className={styles.symbol}>
                  {coin.symbol}
                </span>
              </div>
            </div>
            <span className={styles.amount}>
                {formatCoins(coin.balance ?? 0)}
              </span>
          </div>
        )
      })}
    </div>
  )
};

export default CoinBalances;
