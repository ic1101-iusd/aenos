import React from 'react';

import Input from 'Components/Input';

import styles from './PositionForm.scss';

const PositionForm = () => {
  return (
    <div className={styles.positionForm}>
      <Input
        type="number"
      />
    </div>
  );
};

export default PositionForm;
