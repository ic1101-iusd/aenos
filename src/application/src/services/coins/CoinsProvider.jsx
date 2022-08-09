import React, { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReactGA from 'react-ga';

import config from 'Constants/config';
import { useWallet } from 'Services/wallet';
import logger from 'Utils/logger';
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
  const { principle } = useWallet();

  // todo: check in mainnet working and maybe add loading
  const { updateBalances } = useTokenData({
    coins,
    setCoins,
  });

  const dropBtc = useCallback(async () => {
    if (principle) {
      try {
        logger.log('Dropping... 1 BTC');

        await toast.promise(
          async () => {
            await axios.post(`${config.SERVER_HOST}/transfer/${principle.toString()}`);
            await updateBalances();
          },
          {
            pending: '1 BTC dropping',
            success: '1 BTC dropped',
            error: {
              render({ error }) {
                logger.error('Dropping 1 BTC', error);

                return 'Something went wrong. Try again later.';
              }
            },
          }
        );

        ReactGA.event({
          category: 'User',
          action: 'Dropped 1 FBTC',
        });

        logger.log('Dropped 1 FBTC');
      } catch (e) {
        logger.error(e);
      }
    }
  }, [principle, updateBalances]);

  const value = useMemo(() => {
    return {
      coins,
      updateBalances,
      btc: coins[0],
      iUsd: coins[1],
      dropBtc,
    };
  }, [coins]);

  return (
    <CoinsContext.Provider value={value}>
      {children}
    </CoinsContext.Provider>
  )
};

export default CoinsProvider;
