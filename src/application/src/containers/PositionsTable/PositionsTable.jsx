import React from 'react';
import { useTable } from 'react-table';

import { useVault } from 'Services/vault';
import formulas from 'Utils/formulas';
import { formatDollars, formatStable } from 'Utils/formatters';
import { useCoins } from 'Services/coins';
import { formatPercent } from 'Utils/formatters';

import styles from './PositionsTable.scss';

const PositionsTable = ({ positions, columns }) => {
  const { currentPosition, collateralPrice } = useVault();
  const { iUsd } = useCoins();

  const data = React.useMemo(() => {
    return positions.map((position) => {
      const { updating, deleted, liquidated, id, collateralAmount, stableAmount, owner } = position;

      return {
        ...position,
        active: !(updating || deleted || liquidated),
        current: id === currentPosition?.id,
        collateralLocked: `${collateralAmount} BTC`,
        debt: formatStable(stableAmount),
        collateralRatio: formatPercent(formulas.getCollateralRatio(collateralAmount, collateralPrice, stableAmount)),
        liquidationPrice: formatDollars(formulas.getLiquidationPrice(collateralAmount, stableAmount)),
        owner: owner.toString(),
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
    <div className={styles.tableWrapper}>
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
    </div>
  );
};

export default PositionsTable;
