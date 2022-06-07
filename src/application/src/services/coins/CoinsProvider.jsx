import React, { useState, useMemo } from 'react';

import { mint_token } from 'Declarations/mint_token';
import { fake_btc } from 'Declarations/fake_btc';
import { useWallet } from 'Services/wallet';

import useTokenData from './useTokenData';
import CoinsContext from './CoinsContext';

const defaultCoins = [
  {
    id: 1,
    canister: fake_btc,
  },
  {
    id: 2,
    canister: mint_token,
  },
];

const CoinsProvider = ({ children }) => {
  const [coins, setCoins] = useState(defaultCoins);
  // todo: check in mainnet working and maybe add loading

  const { principle } = useWallet();

  const { fetchTokenData } = useTokenData({
    coins,
    setCoins,
    principle,
  });

  const value = useMemo(() => {
    return {
      coins,
      fetchTokenData,
    };
  }, [coins]);

  return (
    <CoinsContext.Provider value={value}>
      {children}
    </CoinsContext.Provider>
  )
};

export default CoinsProvider;
