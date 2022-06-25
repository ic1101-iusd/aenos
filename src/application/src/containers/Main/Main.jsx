import React, { useMemo } from 'react';

import CoinBalances from 'Containers/CoinBalances';
import Position from 'Containers/Position';
import PositionsTable from 'Containers/PositionsTable';
import { useVault } from 'Services/vault';
import getColumns from 'Containers/PositionsTable/getColumns';

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
