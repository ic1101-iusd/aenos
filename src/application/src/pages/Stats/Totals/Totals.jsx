import React, { useMemo } from 'react';

import { formatBtc, formatDollars, formatStable } from 'Utils/formatters';

import styles from './Totals.scss';

const Totals = ({ positions, collateralPrice }) => {
  const totals = useMemo(() => {
    const totals = positions.reduce((acc, position) => {
      acc.totalCollateral += position.collateralAmount;
      acc.totalDebt += position.stableAmount;
      acc.uniqueOwners.add(position.owner.toString());

      return acc;
    }, {
      totalCollateral: 0,
      totalDebt: 0,
      uniqueOwners: new Set(),
    });

    return {
      ...totals,
      uniqueOwners: totals.uniqueOwners.size,
      totalCollateralValue: totals.totalCollateral * collateralPrice,
      positionAmount: positions.length,
    }
  }, [positions, collateralPrice]);

  return (
    <div className={styles.totals}>
      <div className={styles.total}>
        <div className={styles.totalLabel}>
          Total Collateral
        </div>

        <div className={styles.totalValue}>
          {formatBtc(totals.totalCollateral)}

          <div className={styles.totalSubValue}>
            {formatDollars(totals.totalCollateralValue)}
          </div>
        </div>
      </div>

      <div className={styles.total}>
        <div className={styles.totalLabel}>
          Total Debt
        </div>

        <div className={styles.totalValue}>
          {formatStable(totals.totalDebt)}
        </div>
      </div>

      <div className={styles.total}>
        <div className={styles.totalLabel}>
          Unique Users
        </div>

        <div className={styles.totalValue}>
          {totals.uniqueOwners}
        </div>
      </div>

      <div className={styles.total}>
        <div className={styles.totalLabel}>
          Position Amount
        </div>

        <div className={styles.totalValue}>
          {totals.positionAmount}
        </div>
      </div>
    </div>
  )
};

export default Totals;
