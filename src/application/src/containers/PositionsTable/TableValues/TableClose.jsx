import React, { memo } from 'react';

import Button from 'Components/Button';

import styles from './styles.scss';

const TableClose = ({ id, active, onClose }) => {
  return (
    <Button
      className={styles.closeButton}
      onClick={() => onClose(id)}
      disabled={!active}
    >
      Close
    </Button>
  )
};

export default memo(TableClose);
