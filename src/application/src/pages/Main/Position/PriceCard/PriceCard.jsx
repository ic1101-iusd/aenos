import React from 'react';

import styles from './PriceCard.scss';

const PriceCard = ({ label, amount, afterAmount, children, formatter = (val) => val }) => {
  return (
    <div className={styles.priceCard}>
      <div>
        <div className={styles.label}>
          {label}
        </div>
        <div className={styles.amount}>
          {formatter(amount)}
        </div>
        {afterAmount && amount !== afterAmount ? (
          <div className={styles.badge}>
            {formatter(afterAmount)} after
          </div>
        ) : null}
      </div>

      {children && (
        <div className={styles.children}>
          {children}
        </div>
      )}
    </div>
  );
};

export default PriceCard;
