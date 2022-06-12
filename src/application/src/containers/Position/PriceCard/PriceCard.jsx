import React from 'react';

import styles from './PriceCard.scss';

const PriceCard = ({ label, amount, afterAmount, children }) => {
  return (
    <div className={styles.priceCard}>
      <div>
        <div className={styles.label}>
          {label}
        </div>
        <div className={styles.amount}>
          {amount}
        </div>
        {afterAmount && (
          <div className={styles.badge}>
            {afterAmount} after
          </div>
        )}
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
