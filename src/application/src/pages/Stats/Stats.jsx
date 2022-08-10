import React, { useEffect, useState, useMemo } from 'react';

import { useVault } from 'Services/vault';
import PositionsTable from 'Containers/PositionsTable';
import { statsColumns } from 'Containers/PositionsTable/getColumns';

import Totals from './Totals';
import Filters from './Filters';
import styles from './Stats.scss';

const Stats = () => {
  const [filters, setFilters] = useState({ withActive: true, withLiquidated: true, withClosed: true });

  const { allPositions, getAllPositions, vaultActor, collateralPrice } = useVault();

  useEffect(() => {
    if (vaultActor) {
      getAllPositions();
    }
  }, [vaultActor]);

  const positions = useMemo(() => {
    return allPositions.filter(({ deleted, liquidated }) => {
      const active = !(liquidated || deleted);
      const closed = (deleted && !liquidated);

      if (!filters.withLiquidated && liquidated) {
        return false;
      } else if (!filters.withActive && active) {
        return false;
      } else if (!filters.withClosed && closed) {
        return false;
      }

      return true;
    });
  }, [allPositions, filters]);

  return (
    <div className={styles.statsWrapper}>
      <Filters
        filters={filters}
        setFilters={setFilters}
      />

      <Totals
        positions={positions}
        collateralPrice={collateralPrice}
      />

      <PositionsTable
        positions={positions}
        columns={statsColumns}
      />
    </div>
  )
};

export default Stats;
