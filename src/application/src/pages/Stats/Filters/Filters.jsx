import React, { useCallback } from 'react';
import ReactGA from 'react-ga';

import Checkbox from 'Components/Checkbox';

import styles from './Filters.scss';

const Filters = ({ filters, setFilters }) => {
  const handleChange = useCallback((ev) => {
    ReactGA.event({
      category: 'Stats',
      action: 'Change filters',
      value: ev.target.name,
    });

    setFilters(current => ({
      ...current,
      [ev.target.name]: !current[ev.target.name],
    }));
  }, []);

  return (
    <div className={styles.filters}>
      <div className={styles.filter}>
        <div className={styles.label}>
          Active
        </div>
        <Checkbox
          name="withActive"
          onChange={handleChange}
          checked={filters.withActive}
        />
      </div>

      <div className={styles.filter}>
        <div className={styles.label}>
          Liquidated
        </div>
        <Checkbox
          name="withLiquidated"
          onChange={handleChange}
          checked={filters.withLiquidated}
        />
      </div>

      <div className={styles.filter}>
        <div className={styles.label}>
          Closed
        </div>
        <Checkbox
          name="withClosed"
          onChange={handleChange}
          checked={filters.withClosed}
        />
      </div>
    </div>
  )
};

export default Filters;
