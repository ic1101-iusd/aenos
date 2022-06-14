import { useEffect, useCallback } from 'react';
import memoize from 'memoizee';

import { useWallet } from 'Services/wallet';
import logger from 'Utils/logger';

const getMetadata = memoize((actor, coin) => {
  return actor.getMetadata();
}, {
  normalizer: function([actor, coin]) {
    return coin.id;
  }
});

const useTokenData = ({ coins, setCoins }) => {
  const { principle, plug } = useWallet();

  const fetchTokenData = useCallback(async (principle) => {
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
          const balanceBigInt = await actor.balanceOf(principle);
          balance = Number(balanceBigInt) / Math.pow(10, metaData.decimals);
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

  useEffect(() => {
    if (principle && plug.current) {
      fetchTokenData(principle);
    }
  }, [principle]);

  return {
    fetchTokenData,
  };
};

export default useTokenData;
