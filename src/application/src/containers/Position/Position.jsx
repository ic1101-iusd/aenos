import React, { useState, useCallback, useEffect } from 'react';

import * as formulas from 'Utils/formulas';

import styles from './Position.scss';

const BTC_PRICE_MOCK = 30000;

const Position = () => {
  const [colAmount, setColAmount] = useState(0);
  const [dollars, setDollars] = useState(0);

  const handleColAmount = useCallback((e) => {
    console.log(e);
    setColAmount(Number(e.target.value));
  }, []);
  const handleDollars = useCallback((e) => {
    setDollars(e.target.value);
  });

  useEffect(() => {
    const liquidationRatio = formulas.getLiquidationRation(colAmount, BTC_PRICE_MOCK, dollars);
    const liquidationPrice = formulas.getLiquidationPrice(colAmount, dollars);
    const buyingPower = Math.round(formulas.getBuyingPower(colAmount, BTC_PRICE_MOCK));
    const avDollars = formulas.getAvailableDollars(colAmount, BTC_PRICE_MOCK);

    console.log({
      liquidationRatio,
      liquidationPrice,
      buyingPower,
      avDollars,
    });
  }, [colAmount, dollars]);

  console.log({ colAmount, dollars })

  return (
    <div>
      <input className={styles.input} type="text" onChange={handleColAmount} />
      <input className={styles.input} type="text" onChange={handleDollars} />
    </div>
  );
};

export default Position;
