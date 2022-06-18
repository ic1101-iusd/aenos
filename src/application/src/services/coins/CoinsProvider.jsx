import React, { useState, useMemo } from 'react';

import { canisterId as iUsdCanisterId, idlFactory as iUsdIdl } from 'Declarations/mint_token';
import { canisterId as btcCanisterId, idlFactory as btcIdl } from 'Declarations/fake_btc';

import useTokenData from './useTokenData';
import CoinsContext from './CoinsContext';

const defaultCoins = [
  {
    id: 1,
    canisterId: btcCanisterId,
    idl: btcIdl,
  },
  {
    id: 2,
    canisterId: iUsdCanisterId,
    idl: iUsdIdl,
  },
];

const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState(defaultCoins);
  // todo: check in mainnet working and maybe add loading

  const { updateBalances } = useTokenData({
    coins,
    setCoins,
  });

  const value = useMemo(() => {
    return {
      coins,
      updateBalances,
      btc: coins[0],
      iUsd: coins[1],
    };
  }, [coins]);

  return (
    <CoinsContext.Provider value={value}>
      {children}
    </CoinsContext.Provider>
  )
};

export default CoinsProvider;
