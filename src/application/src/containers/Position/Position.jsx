import React, { useState, useMemo, useCallback } from 'react';

import formulas from 'Utils/formulas';
import { formatDollars } from 'Utils/formatters';
import { useVault } from 'Services/vault';

import PriceCard from './PriceCard';
import PositionForm from './PositionForm';
import styles from './Position.scss';

const getStats = ({ collateralRatio, collateralAmount, currentPrice, prevCollateralLocked }) => {
  const collateralLocked = collateralAmount + prevCollateralLocked;

  formulas.collateralRatio = collateralRatio;
  formulas.collateralPrice = currentPrice;
  formulas.collateralAmount = collateralAmount;
  const liquidationPrice = formulas.getLiquidationPrice();
  const buyingPower = Math.round(formulas.getBuyingPower(collateralAmount));
  const availableDollars = formulas.getAvailableDollars(collateralAmount);

  return {
    liquidationPrice,
    buyingPower,
    availableDollars,
    collateralLocked,
    collateralLockedUsd: collateralLocked * currentPrice,
  };
};

const Position = () => {
  const [collateralAmount, setCollateralAmount] = useState(0);
  // default 300% (low risk)
  const [collateralRatio, setCollateralRatio] = useState(3);
  const { createPosition, collateralPrice: currentPrice } = useVault();

  const stats = useMemo(() => {
    return {
      liquidationPrice: 0,
      buyingPower: 0,
      availableDollars: 0,
      collateralLocked: 0,
      collateralLockedUsd: 0,
    };
  }, []);

  const nextStats = useMemo(() => {
    return getStats({
      collateralAmount,
      collateralRatio,
      currentPrice,
      prevCollateralLocked: stats.collateralLocked,
    });
  }, [collateralAmount, collateralRatio, currentPrice, stats.collateralLocked]);

  const handleSubmit = useCallback(() => {
    createPosition(collateralAmount, nextStats.availableDollars);
  }, [nextStats.availableDollars, collateralAmount]);

  return (
    <div className={styles.position}>
      <div className={styles.cards}>
        <div className={styles.column}>
          <PriceCard
            label="Liquidation Price"
            formatter={formatDollars}
            amount={stats.liquidationPrice}
            afterAmount={nextStats.liquidationPrice}
          />
          <PriceCard
            label="Current Price"
            formatter={formatDollars}
            amount={currentPrice}
          />
        </div>
        <div className={styles.column}>
          <PriceCard
            label="Buying Power"
            formatter={formatDollars}
            amount={stats.buyingPower}
            afterAmount={nextStats.buyingPower}
          >
            {(stats.buyingPower / currentPrice).toFixed(8)} WBTC
          </PriceCard>
          <PriceCard
            label="Collateral Locked"
            formatter={formatDollars}
            amount={stats.collateralLockedUsd}
            afterAmount={nextStats.collateralLockedUsd}
          >
            {stats.collateralLocked} WBTC
          </PriceCard>
        </div>
      </div>

      <PositionForm
        collateralAmount={collateralAmount}
        setCollateralAmount={setCollateralAmount}
        collateralRatio={collateralRatio}
        setCollateralRatio={setCollateralRatio}
        currentPrice={currentPrice}
        liquidationPrice={nextStats.liquidationPrice}
        availableDollars={nextStats.availableDollars}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Position;
