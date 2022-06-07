import { useEffect, useCallback } from 'react';
import logger from 'Utils/logger';
import memoize from 'memoizee';

const getMetadata = memoize((coin) => {
  return coin.canister.getMetadata();
}, {
  normalizer: function([coin]) {
    return coin.id;
  }
});

const useTokenData = ({ coins, setCoins, principle }) => {
  const fetchTokenData = useCallback(async (principle) => {
    try {
      const mergedCoins = [];

      for (let i = 0; i < coins.length; i++) {
        const metaData = await getMetadata(coins[i]);
        let balance = null;

        if (principle) {
          const balanceBigInt = await coins[i].canister.balanceOf(principle);
          balance = Number(balanceBigInt) / Math.pow(10, metaData.decimals);
        }

        mergedCoins[i] = {
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
    fetchTokenData(principle);
  }, [principle]);

  return {
    fetchTokenData,
  };
};

export default useTokenData;
