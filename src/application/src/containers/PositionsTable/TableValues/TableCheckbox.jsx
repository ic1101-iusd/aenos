import React, { memo } from 'react';

import Checkbox from 'Components/Checkbox';

import styles from './styles.scss';

const TableCheckbox = ({ id, current, active, onSelect }) => {
  return (
    <Checkbox
      className={styles.checkbox}
      disabled={!active}
      checked={current}
      onChange={() => onSelect(id)}
    />
  )
};

export default memo(TableCheckbox);
