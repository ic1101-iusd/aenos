import { useEffect, useCallback } from 'react';
import memoize from 'memoizee';

import { useWallet } from 'Services/wallet';
import logger from 'Utils/logger';
import { fromBigInt } from 'Utils/formatters';

const getMetadata = memoize((actor, coin) => {
  return actor.getMetadata();
}, {
  normalizer: function([actor, coin]) {
    return coin.id;
  }
});

const useTokenData = ({ coins, setCoins }) => {
  const { principle, plug } = useWallet();

  const initTokenData = useCallback(async (principle) => {
    try {
      const mergedCoins = [];

      for (let i = 0; i < coins.length; i++) {
        const actor = await plug.current.createActor({
          canisterId: coins[i].canisterId,
          interfaceFactory: coins[i].idl,
        });

        const metaData = await getMetadata(actor, coins[i]);
        let balance = null;

        if (principle) {
          balance = fromBigInt(await actor.balanceOf(principle));
        }

        mergedCoins[i] = {
          actor,
          ...coins[i],
          ...metaData,
          balance: balance ?? '-',
        };
      }

      setCoins(mergedCoins);
    } catch (e) {
      logger.error(e);
    }
  }, [coins, principle]);

  const updateBalances = useCallback(async () => {
    const updatedCoins = [];

    for (let i = 0; i < coins.length; i++) {
      const balance = fromBigInt(await coins[i].actor.balanceOf(principle));

      updatedCoins[i] = {
        ...coins[i],
        balance,
      };
    }

    setCoins(updatedCoins);
  }, [coins, principle]);

  useEffect(() => {
    if (principle && plug.current) {
      initTokenData(principle);
    }
  }, [principle]);

  return {
    updateBalances,
  };
};

export default useTokenData;
