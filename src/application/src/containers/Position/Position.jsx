import React, { useState, useMemo, useCallback, useEffect } from 'react';

import formulas from 'Utils/formulas';
import { formatDollars } from 'Utils/formatters';
import { useVault } from 'Services/vault';

import { DEFAULT_STATS, DEFAULT_MAX_RATIO, MIN_RATIO } from './constants';
import PriceCard from './PriceCard';
import PositionForm from './PositionForm';
import styles from './Position.scss';

const Position = () => {
  const [collateralAmount, setCollateralAmount] = useState(0);
  // default 1000% (low risk)
  const [collateralRatio, setCollateralRatio] = useState(DEFAULT_MAX_RATIO);
  const [maxRatio, setMaxRatio] = useState(DEFAULT_MAX_RATIO);
  const [minRatio, setMinRatio] = useState(MIN_RATIO);
  const [isDeposit, setIsDeposit] = useState(true);

  const {
    createPosition,
    collateralPrice,
    currentPosition,
    updatePosition,
    closePosition,
  } = useVault();

  const currentStats = useMemo(() => {
    if (!currentPosition || !collateralPrice || currentPosition.collateralAmount === 0) {
      return DEFAULT_STATS;
    }

    const collateralRatio = formulas.getCollateralRatio(currentPosition.collateralAmount, collateralPrice, currentPosition.stableAmount);
    const liquidationPrice = formulas.getLiquidationPrice(currentPosition.collateralAmount, currentPosition.stableAmount);

    setCollateralRatio(collateralRatio);

    return {
      liquidationPrice: Number(liquidationPrice.toFixed(5)),
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
      liquidationPrice: Number(liquidationPrice.toFixed(5)),
      debt: Number(debt.toFixed(5)),
      collateralLockedUsd: totalCollateralAmount * collateralPrice,
    };
  }, [collateralAmount, collateralRatio, collateralPrice, currentStats]);

  const marks = useMemo(() => {
    if (!collateralAmount || !currentStats.collateralLocked) return {};

    const totalCollateralAmount = Number(collateralAmount) + currentStats.collateralLocked;

    const noGenerateCollateralRatio = formulas.getCollateralRatio(totalCollateralAmount, collateralPrice, currentStats.debt);

    setCollateralRatio(noGenerateCollateralRatio);
    if (maxRatio < noGenerateCollateralRatio) {
      setMaxRatio(noGenerateCollateralRatio);
    }
    if (minRatio > noGenerateCollateralRatio && noGenerateCollateralRatio >= 0) {
      setMinRatio(noGenerateCollateralRatio);
    }

    return {
      [noGenerateCollateralRatio]: {
        style: {
          fontSize: '0.7rem',
        },
        label: isDeposit ? 'Deposit' : 'Withdraw',
      },
    };
  }, [collateralAmount]);

  useEffect(() => {
    setCollateralAmount(current => current * -1);
  }, [isDeposit]);

  const handleSubmit = useCallback(async () => {
    if (currentPosition) {
      // when collateralRatio == 0 it means we're withdrawing the whole locked collateral -> we're closing position
      if (collateralRatio === 0 && Math.abs(collateralAmount) === currentPosition.collateralAmount) {
        await closePosition(currentPosition.id);

        setCollateralRatio(DEFAULT_MAX_RATIO);
      } else {
        await updatePosition(currentPosition.id, collateralAmount, nextStats.debt - currentStats.debt);
      }
    } else {
      await createPosition(collateralAmount, nextStats.debt);
    }

    setCollateralAmount(0);
  }, [nextStats, collateralAmount, currentPosition]);

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
            {currentStats.collateralLocked} BTC
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
        maxRatio={maxRatio}
        minRatio={minRatio}
        isDeposit={isDeposit}
        setIsDeposit={setIsDeposit}
      />
    </div>
  );
};

export default Position;
