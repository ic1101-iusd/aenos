import React from 'react';
import { useTable } from 'react-table';

import { useVault } from 'Services/vault';
import formulas from 'Utils/formulas';

import styles from './PositionsTable.scss';

// Current (checkbox) | Collateral Locked (collateralAmount) | Debt (stableAmount) | collateralRatio (formula) | liquidationPrice (formula) | x (delete position - method coming soon)
const PositionsTable = () => {
  const { positions, currentPosition, setCurrentPosition } = useVault();

  console.log({ positions, currentPosition });

  return (
    <div
      className={styles.positionsTable}
    >
      lol
    </div>
  )
};

export default PositionsTable;
