import React, { useCallback, useRef, useMemo } from 'react';
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
  collateralPrice,
  stableAmount,
  onSubmit,
  marks,
  maxRatio,
}) => {
  const collateralInputRef = useRef();
  const { coins } = useCoins();
  const bitcoin = coins[0];

  const handleSubmit = useCallback(() => {
    onSubmit();
    collateralInputRef.current.value = '';
  }, [onSubmit]);

  const handleBalanceClick = useCallback(() => {
    setCollateralAmount(bitcoin.balance);
    collateralInputRef.current.value = bitcoin.balance;
  }, [bitcoin]);

  const buttonLabel = useMemo(() => {
    if (stableAmount > 0) {
      return `Generate ${stableAmount.toFixed(2)} AIS`;
    } else if (stableAmount < 0) {
      return `Repay ${(stableAmount * -1).toFixed(2)} AIS`;
    } else if (stableAmount === 0 && collateralAmount) {
      return 'Deposit';
    }
  }, [stableAmount, collateralAmount]);

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
          ~{formatDollars(collateralPrice)}
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

        <div className={styles.sliderHints}>
          <div className={styles.hint}>
            Lowest Risk
          </div>
          <div className={styles.hint}>
            Highest Risk
          </div>
        </div>

        <Slider
          className={styles.sliderHandler}
          min={1.2}
          max={maxRatio}
          reverse
          step={(maxRatio - 1.2) / 100}
          value={collateralRatio}
          defaultValue={collateralRatio}
          onChange={setCollateralRatio}
          marks={marks}
          // disabled={!collateralAmount}
          railStyle={{
            backgroundColor: styleVars.primaryColor,
          }}
          trackStyle={{
            backgroundColor: styleVars.elementBackground,
          }}
        />

      </div>

      <Button onClick={handleSubmit} disabled={!buttonLabel}>
        {buttonLabel ?? 'Update your configuration'}
      </Button>
    </div>
  );
};

export default PositionForm;
