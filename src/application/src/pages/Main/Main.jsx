import React, { useMemo } from 'react';

import PositionsTable from 'Containers/PositionsTable';
import getColumns from 'Containers/PositionsTable/getColumns';
import { useVault } from 'Services/vault';

import Position from './Position';
import CoinBalances from './CoinBalances';

const Main = () => {
  const { positions, selectPosition, closePosition } = useVault();

  const columns = useMemo(() => {
    return getColumns({
      onClose: closePosition,
      onSelect: selectPosition,
    });
  }, [closePosition, selectPosition]);

  return (
    <>
      <CoinBalances />
      <Position />
      <PositionsTable
        columns={columns}
        positions={positions}
      />
    </>
  )
};

export default Main;
