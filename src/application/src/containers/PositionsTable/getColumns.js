import React from 'react';

import TableCheckbox from './TableValues/TableCheckbox';
import TableClose from './TableValues/TableClose';
import PositionStatus from './TableValues/PositionStatus';
import Principle from './TableValues/Principle';

const commonColumns = [
  {
    Header: 'Collateral Locked',
    accessor: 'collateralLocked',
  },
  {
    Header: 'Debt',
    accessor: 'debt',
  },
  {
    Header: 'Collateral ratio',
    accessor: 'collateralRatio',
  },
  {
    Header: 'Liquidation price',
    accessor: 'liquidationPrice',
  },
  {
    Header: 'Status',
    accessor: 'status',
    Cell: PositionStatus,
  },
];

const getColumns = ({ onSelect, onClose }) => {
  return [
    {
      Header: 'Active',
      accessor: 'activePosition',
      Cell: (position) => <TableCheckbox {...position} onSelect={onSelect} />,
    },
    ...commonColumns,
    {
      Header: 'Close position',
      accessor: 'close',
      Cell: (position) => <TableClose {...position} onClose={onClose} />,
    }
  ];
};

export const statsColumns = [
  ...commonColumns,
  {
    Header: 'Owner',
    accessor: 'owner',
    Cell: Principle,
  },
];

export default getColumns;
