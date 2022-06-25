import React, { useCallback, useMemo } from 'react';
import { useTable } from 'react-table';

import { useVault } from 'Services/vault';
import formulas from 'Utils/formulas';
import { formatDollars, formatStable } from 'Utils/formatters';
import { useCoins } from 'Services/coins';
import { formatPercent } from 'Utils/formatters';

import getColumns from './getColumns';

import styles from './PositionsTable.scss';

const PositionsTable = () => {
  const { positions, currentPosition, setCurrentPosition, collateralPrice, closePosition } = useVault();
  const { iUsd } = useCoins();

  const handleSelectPosition = useCallback((id) => {
    // unset current position
    if (currentPosition?.id === id) {
      setCurrentPosition(null);
      return;
    }

    setCurrentPosition(
      positions.find(position => position.id === id)
    );
  }, [positions, currentPosition]);

  const columns = useMemo(() => {
    return getColumns({
      onClose: closePosition,
      onSelect: handleSelectPosition,
    });
  }, [closePosition, handleSelectPosition]);

  const data = React.useMemo(() => {
    return positions.map((position) => {
      const { updating, deleted, liquidated, id, collateralAmount, stableAmount } = position;

      return {
        ...position,
        active: !(updating || deleted || liquidated),
        current: id === currentPosition?.id,
        collateralLocked: `${collateralAmount} BTC`,
        debt: formatStable(stableAmount),
        collateralRatio: formatPercent(formulas.getCollateralRatio(collateralAmount, collateralPrice, stableAmount)),
        liquidationPrice: formatDollars(formulas.getLiquidationPrice(collateralAmount, stableAmount)),
      };
    });
  }, [positions, currentPosition, collateralPrice, iUsd]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()} className={styles.positionsTable}>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map(column => (
              <th key={column.id} {...column.getHeaderProps()}>
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>

      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);

          return (
            <tr {...row.getRowProps()} key={row.original.id}>
              {row.cells.map((cell, index) => {
                return (
                  <td key={index}>
                    {cell.render('Cell', cell.row.original)}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PositionsTable;
