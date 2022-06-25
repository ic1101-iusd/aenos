import React, { useEffect, useMemo } from 'react';

import { useVault } from 'Services/vault';
import { formatStable, formatBtc, formatDollars } from 'Utils/formatters';

import styles from './Stats.scss';

const Stats = () => {
  const { allPositions, getAllPositions, vaultActor, collateralPrice } = useVault();

  useEffect(() => {
    if (vaultActor) {
      getAllPositions();
    }
  }, [vaultActor]);

  const stats = useMemo(() => {
    const stats = allPositions.reduce((acc, position) => {
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
      ...stats,
      uniqueOwners: stats.uniqueOwners.size,
      totalCollateralValue: stats.totalCollateral * collateralPrice,
      positionAmount: allPositions.length,
    }
  }, [allPositions, collateralPrice]);

  return (
    <div className={styles.statsWrapper}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statLabel}>
            Total Collateral
          </div>

          <div className={styles.statValue}>
            {formatBtc(stats.totalCollateral)}

            <div className={styles.statSubValue}>
              {formatDollars(stats.totalCollateralValue)}
            </div>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statLabel}>
            Total Debt
          </div>

          <div className={styles.statValue}>
            {formatStable(stats.totalDebt)}
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statLabel}>
            Unique Users
          </div>

          <div className={styles.statValue}>
            {stats.uniqueOwners}
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statLabel}>
            Position Amount
          </div>

          <div className={styles.statValue}>
            {stats.positionAmount}
          </div>
        </div>
      </div>


    </div>
  )
};

export default Stats;
