import React, { useState, useMemo, useCallback, useEffect } from 'react';

import formulas from 'Utils/formulas';
import { formatDollars, formatStable } from 'Utils/formatters';
import { useVault } from 'Services/vault';

import { DEFAULT_STATS, DEFAULT_MAX_RATIO, MIN_RATIO } from './constants';
import PriceCard from './PriceCard';
import PositionForm from './PositionForm';
import styles from './Position.scss';

export const defaults = {
  collateralAmount: '',
  collateralRatio: DEFAULT_MAX_RATIO,
  maxRatio: DEFAULT_MAX_RATIO,
  minRatio: MIN_RATIO,
};

const Position = () => {
  const [collateralAmount, setCollateralAmount] = useState(defaults.collateralAmount);
  // default 1000% (low risk)
  const [collateralRatio, setCollateralRatio] = useState(defaults.collateralRatio);
  const [maxRatio, setMaxRatio] = useState(defaults.maxRatio);
  const [minRatio, setMinRatio] = useState(defaults.minRatio);
  const [isDeposit, setIsDeposit] = useState(true);

  const colAmountNumber = useMemo(() => {
    return Number(collateralAmount) * (isDeposit ? 1 : -1);
  }, [isDeposit, collateralAmount]);

  const {
    createPosition,
    collateralPrice,
    collateralNextPrice,
    currentPosition,
    updatePosition,
    closePosition,
  } = useVault();

  useEffect(() => {
    if (!currentPosition) {
      setCollateralRatio(defaults.collateralRatio);
    }
    setCollateralAmount(defaults.collateralAmount);
    setMaxRatio(defaults.maxRatio);
    setMinRatio(defaults.minRatio);
  }, [currentPosition]);

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
      collateralRatio,
    };
  }, [currentPosition, collateralPrice]);

  const nextStats = useMemo(() => {
    const totalCollateralAmount = colAmountNumber + currentStats.collateralLocked;

    const debt = formulas.getAvailableDollars(totalCollateralAmount, collateralPrice, collateralRatio);
    const liquidationPrice = formulas.getLiquidationPrice(totalCollateralAmount, debt);

    return {
      liquidationPrice: Number(liquidationPrice.toFixed(5)),
      debt: Number(debt.toFixed(5)),
      collateralLockedUsd: totalCollateralAmount * collateralPrice,
    };
  }, [colAmountNumber, collateralRatio, collateralPrice, currentStats]);

  const marks = useMemo(() => {
    if (!colAmountNumber || !currentStats.collateralLocked) return {};

    const totalCollateralAmount = colAmountNumber + currentStats.collateralLocked;

    const noGenerateCollateralRatio = formulas.getCollateralRatio(totalCollateralAmount, collateralPrice, currentStats.debt);

    setCollateralRatio(noGenerateCollateralRatio);
    if (DEFAULT_MAX_RATIO < noGenerateCollateralRatio) {
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
  }, [colAmountNumber]);

  const handleSubmit = useCallback(async () => {
    if (currentPosition) {
      // when collateralRatio == 0 it means we're withdrawing the whole locked collateral -> we're closing position
      if (collateralRatio === 0 && Math.abs(colAmountNumber) === currentPosition.collateralAmount) {
        await closePosition(currentPosition.id);

        setCollateralRatio(DEFAULT_MAX_RATIO);
      } else {
        await updatePosition(currentPosition.id, colAmountNumber, nextStats.debt - currentStats.debt);
      }
    } else {
      await createPosition(colAmountNumber, nextStats.debt);
    }

    setCollateralAmount(defaults.collateralAmount);
  }, [nextStats, colAmountNumber, currentPosition, isDeposit, closePosition, updatePosition, createPosition]);

  const handleLockedCollateralSet = useCallback(() => {
    setCollateralAmount(currentStats.collateralLocked);
    setIsDeposit(false);
  }, [currentStats.collateralLocked]);

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
          >
            <div title="Simulation of price changing by our bot">
              Next price: {formatDollars(collateralNextPrice.value)}

              <div className={styles.collateralNextPriceTime}>
                Will be changed at {collateralNextPrice.time}
              </div>
            </div>
          </PriceCard>
        </div>
        <div className={styles.column}>
          <PriceCard
            label="Debt"
            formatter={formatStable}
            amount={currentStats.debt}
            afterAmount={nextStats.debt}
          />
          <PriceCard
            label="Collateral Locked"
            formatter={formatDollars}
            amount={currentStats.collateralLockedUsd}
            afterAmount={nextStats.collateralLockedUsd}
          >
            <div
              className={styles.lockedAmount}
              onClick={handleLockedCollateralSet}
            >
              {currentStats.collateralLocked} BTC
            </div>
          </PriceCard>
        </div>
      </div>

      <PositionForm
        collateralAmount={collateralAmount}
        setCollateralAmount={setCollateralAmount}
        collateralRatio={collateralRatio}
        setCollateralRatio={setCollateralRatio}
        liquidationPrice={nextStats.liquidationPrice}
        stableAmount={nextStats.debt - currentStats.debt}
        onSubmit={handleSubmit}
        marks={marks}
        maxRatio={maxRatio}
        minRatio={minRatio}
        isDeposit={isDeposit}
        setIsDeposit={setIsDeposit}
        currentStats={currentStats}
      />
    </div>
  );
};

export default Position;
