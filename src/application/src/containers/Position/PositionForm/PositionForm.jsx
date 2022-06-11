import React from 'react';
import Slider from 'rc-slider';

import Input from 'Components/Input';

import styles from './PositionForm.scss';

const PositionForm = () => {
  return (
    <div className={styles.positionForm}>
      <Input
        type="number"
      />

      <Slider
        min={1}
        max={3}
        reverse
        step={0.01}
        defaultValue={3}
        onChange={(nextValues) => {
          console.log('Change:', nextValues);
        }}
      />
    </div>
  );
};

export default PositionForm;
