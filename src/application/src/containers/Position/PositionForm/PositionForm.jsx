import React from 'react';
import Slider from 'rc-slider';

import Input from 'Components/Input';
import Button from 'Components/Button';
import { useCoins } from 'Services/coins';
import styleVars from 'Styles/variables.scss';

import styles from './PositionForm.scss';

const PositionForm = () => {
  const { coins } = useCoins();
  const bitcoin = coins[0];

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

          <div className={styles.balance}>
            {bitcoin.balance} BTC
          </div>
        </div>
        <Input
          className={styles.input}
          type="number"
        />
        <div className={styles.usdAmount}>
          ~${30000}
        </div>
      </div>

      <div className={styles.slider}>

        <div className={styles.sliderInfo}>
          <div className={styles.group}>
            <div className={styles.label}>
              Liquidation Price
            </div>
            <div className={styles.amount}>
              {25000}
            </div>
          </div>

          <div className={styles.group}>
            <div className={styles.label}>
              Collateral Ratio
            </div>
            <div className={styles.amount}>
              150%
            </div>
          </div>
        </div>

        <Slider
          min={1}
          max={3}
          reverse
          step={0.01}
          defaultValue={3}
          onChange={(nextValues) => {
            console.log('Change:', nextValues);
          }}
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

      <Button
        className={styles.button}
      >
        Generate 1000 DAS
      </Button>
    </div>
  );
};

export default PositionForm;
