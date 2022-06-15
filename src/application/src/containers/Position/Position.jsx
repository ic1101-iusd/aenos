import React, { useState, useMemo, useCallback } from 'react';

import formulas from 'Utils/formulas';
import { formatDollars } from 'Utils/formatters';
import { useVault } from 'Services/vault';

import PriceCard from './PriceCard';
import PositionForm from './PositionForm';
import styles from './Position.scss';

const DEFAULT_STATS = {
  liquidationPrice: 0,
  debt: 0,
  collateralLocked: 0,
  collateralLockedUsd: 0,
};

const Position = () => {
  const [collateralAmount, setCollateralAmount] = useState(0);
  // default 300% (low risk)
  const [collateralRatio, setCollateralRatio] = useState(3);

  const { createPosition, collateralPrice, currentPosition } = useVault();

  const currentStats = useMemo(() => {
    if (!currentPosition || !collateralPrice) {
      return DEFAULT_STATS;
    }

    const collateralRatio = formulas.getCollateralRatio(currentPosition.collateralAmount, collateralPrice, currentPosition.stableAmount);
    const liquidationPrice = formulas.getLiquidationPrice(currentPosition.collateralAmount, currentPosition.stableAmount);

    setCollateralRatio(collateralRatio);

    return {
      liquidationPrice,
      debt: Number(currentPosition.stableAmount.toFixed(5)),
      collateralLocked: currentPosition.collateralAmount,
      collateralLockedUsd: currentPosition.collateralAmount * collateralPrice,
    };
  }, [currentPosition, collateralPrice]);

  const nextStats = useMemo(() => {
    const totalCollateralAmount = Number(collateralAmount) + currentStats.collateralLocked;

    const debt = formulas.getAvailableDollars(totalCollateralAmount, collateralPrice, collateralRatio);
    const liquidationPrice = formulas.getLiquidationPrice(totalCollateralAmount, debt);

    return {
      liquidationPrice,
      debt: Number(debt.toFixed(5)),
      collateralLockedUsd: totalCollateralAmount * collateralPrice,
    };
  }, [collateralAmount, collateralRatio, collateralPrice, currentStats]);

  const marks = useMemo(() => {
    const totalCollateralAmount = Number(collateralAmount) + currentStats.collateralLocked;

    const noGenerateCollateralRatio = collateralAmount ?
      formulas.getCollateralRatio(totalCollateralAmount, collateralPrice, currentStats.debt) : null;

    if (noGenerateCollateralRatio) {
      setCollateralRatio(noGenerateCollateralRatio);
    }

    return noGenerateCollateralRatio ? {
      [noGenerateCollateralRatio]: {
        style: {
          fontSize: '0.7rem',
        },
        label: 'Deposit',
      },
    } : {};
  }, [collateralAmount, currentStats]);

  const handleSubmit = useCallback(() => {
    createPosition(collateralAmount, nextStats.debt);
  }, [nextStats, collateralAmount]);

  return (
    <div className={styles.position}>
      <div className={styles.cards}>
        <div className={styles.column}>
          <PriceCard
            label="Liquidation Price"
            formatter={formatDollars}
            amount={currentStats.liquidationPrice}
            afterAmount={nextStats.liquidationPrice}
          />
          <PriceCard
            label="Current Price"
            formatter={formatDollars}
            amount={collateralPrice}
          />
        </div>
        <div className={styles.column}>
          <PriceCard
            label="Debt"
            formatter={formatDollars}
            amount={currentStats.debt}
            afterAmount={nextStats.debt}
          />
          <PriceCard
            label="Collateral Locked"
            formatter={formatDollars}
            amount={currentStats.collateralLockedUsd}
            afterAmount={nextStats.collateralLockedUsd}
          >
            {currentStats.collateralLocked} WBTC
          </PriceCard>
        </div>
      </div>

      <PositionForm
        collateralAmount={collateralAmount}
        setCollateralAmount={setCollateralAmount}
        collateralRatio={collateralRatio}
        setCollateralRatio={setCollateralRatio}
        collateralPrice={collateralPrice}
        liquidationPrice={nextStats.liquidationPrice}
        stableAmount={nextStats.debt - currentStats.debt}
        onSubmit={handleSubmit}
        marks={marks}
      />
    </div>
  );
};

export default Position;
