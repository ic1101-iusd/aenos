import React, { useCallback, useRef } from 'react';
import Slider from 'rc-slider';

import Input from 'Components/Input';
import Button from 'Components/Button';
import { useCoins } from 'Services/coins';
import { formatDollars, formatPercent } from 'Utils/formatters';
import styleVars from 'Styles/variables.scss';

import styles from './PositionForm.scss';

const ONE_MILLION = 10**6;

const PositionForm = ({
  collateralAmount,
  setCollateralAmount,
  collateralRatio,
  setCollateralRatio,
  liquidationPrice,
  currentPrice,
  availableDollars,
  onSubmit,
}) => {
  const collateralInputRef = useRef();
  const { coins } = useCoins();
  const bitcoin = coins[0];

  const handleBalanceClick = useCallback(() => {
    setCollateralAmount(bitcoin.balance);
    collateralInputRef.current.value = bitcoin.balance;
  }, [bitcoin]);

  return (
    <div className={styles.positionForm}>
      <div>
        <div className={styles.title}>
          Configure your Vault
        </div>

        <div className={styles.intro}>
          Deposit BTC - generate DAS
        </div>
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.inputDetails}>
          <div className={styles.inputLabel}>
            Deposit BTC
          </div>

          <div
            className={styles.balance}
            onClick={handleBalanceClick}
          >
            {bitcoin.balance} BTC
          </div>
        </div>
        <Input
          className={styles.input}
          onChange={setCollateralAmount}
          placeholder="0.00"
          max={ONE_MILLION}
          type="number"
          ref={collateralInputRef}
        />
        <div className={styles.usdAmount}>
          ~{formatDollars(currentPrice)}
        </div>
      </div>

      <div className={styles.slider}>

        <div className={styles.sliderInfo}>
          <div className={styles.group}>
            <div className={styles.label}>
              Liquidation Price
            </div>
            <div className={styles.amount}>
              {formatDollars(liquidationPrice)}
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.label}>
              Collateral Ratio
            </div>
            <div className={styles.amount}>
              {formatPercent(collateralRatio)}
            </div>
          </div>
        </div>

        <Slider
          className={styles.sliderHandler}
          min={1}
          max={3}
          reverse
          step={0.01}
          value={collateralRatio}
          defaultValue={collateralRatio}
          onChange={setCollateralRatio}
          disabled={!collateralAmount}
          railStyle={{
            backgroundColor: styleVars.primaryColor,
          }}
          trackStyle={{
            backgroundColor: styleVars.elementBackground,
          }}
        />

        <div className={styles.sliderHints}>
          <div className={styles.hint}>
            Lowest Risk
          </div>
          <div className={styles.hint}>
            Highest Risk
          </div>
        </div>

      </div>

      <Button onClick={onSubmit}>
        Generate {availableDollars.toFixed(2)} USB
      </Button>
    </div>
  );
};

export default PositionForm;
